terraform {
  required_version = ">= 1.6"
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
  }
}

provider "kubernetes" {
  config_path    = "~/.kube/config"
  config_context = "docker-desktop"   # or "minikube"
}

# ── Namespace ──────────────────────────────────────────────
resource "kubernetes_namespace" "patient_platform" {
  metadata { name = "patient-platform" }
}

# ── Secret ─────────────────────────────────────────────────
# NOTE: database-url is constructed here for local dev convenience.
# In production, use an external secrets manager (Vault, AWS SSM, etc.)
# and inject secrets outside of Terraform state.
resource "kubernetes_secret" "patient_tracker" {
  metadata {
    name      = "patient-tracker-secrets"
    namespace = kubernetes_namespace.patient_platform.metadata[0].name
  }
  data = {
    postgres-password = var.postgres_password
    database-url      = "postgresql+asyncpg://${var.postgres_user}:${var.postgres_password}@postgres-service:5432/${var.postgres_db}"
  }
}

# ── PVC ────────────────────────────────────────────────────
resource "kubernetes_persistent_volume_claim" "postgres" {
  metadata {
    name      = "postgres-pvc"
    namespace = kubernetes_namespace.patient_platform.metadata[0].name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = { storage = "1Gi" }
    }
  }
}

# ── Postgres Service (must precede StatefulSet) ────────────
resource "kubernetes_service" "postgres" {
  metadata {
    name      = "postgres-service"
    namespace = kubernetes_namespace.patient_platform.metadata[0].name
  }
  spec {
    selector = { app = "postgres" }
    port {
      port        = 5432
      target_port = 5432
    }
  }
}

# ── Postgres StatefulSet ───────────────────────────────────
resource "kubernetes_stateful_set" "postgres" {
  metadata {
    name      = "postgres"
    namespace = kubernetes_namespace.patient_platform.metadata[0].name
  }
  spec {
    replicas     = 1
    service_name = kubernetes_service.postgres.metadata[0].name
    selector { match_labels = { app = "postgres" } }
    template {
      metadata { labels = { app = "postgres" } }
      spec {
        container {
          name  = "postgres"
          image = "postgres:16-alpine"
          port { container_port = 5432 }

          env {
            name  = "POSTGRES_USER"
            value = var.postgres_user
          }
          env {
            name  = "POSTGRES_DB"
            value = var.postgres_db
          }
          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.patient_tracker.metadata[0].name
                key  = "postgres-password"
              }
            }
          }
          volume_mount {
            name       = "postgres-data"
            mount_path = "/var/lib/postgresql/data"
            sub_path   = "pgdata"
          }
        }
        volume {
          name = "postgres-data"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.postgres.metadata[0].name
          }
        }
      }
    }
  }
}

# ── API ────────────────────────────────────────────────────
resource "kubernetes_deployment" "api" {
  metadata {
    name      = "patient-tracker-api"
    namespace = kubernetes_namespace.patient_platform.metadata[0].name
  }
  spec {
    replicas = 2
    selector { match_labels = { app = "patient-tracker-api" } }
    template {
      metadata { labels = { app = "patient-tracker-api" } }
      spec {
        init_container {
          name              = "run-migrations"
          image             = "patient-tracker-api:latest"
          image_pull_policy = "Never"
          command           = ["alembic", "upgrade", "head"]
          env {
            name = "DATABASE_URL"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.patient_tracker.metadata[0].name
                key  = "database-url"
              }
            }
          }
        }
        container {
          name              = "api"
          image             = "patient-tracker-api:latest"
          image_pull_policy = "Never"
          port { container_port = 8000 }
          env {
            name = "DATABASE_URL"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.patient_tracker.metadata[0].name
                key  = "database-url"
              }
            }
          }
          env {
            name  = "CORS_ORIGINS"
            value = "http://localhost"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "api" {
  metadata {
    name      = "patient-tracker-api-service"
    namespace = kubernetes_namespace.patient_platform.metadata[0].name
  }
  spec {
    selector = { app = "patient-tracker-api" }
    port {
      port        = 8000
      target_port = 8000
    }
  }
}

# ── Web ────────────────────────────────────────────────────
resource "kubernetes_deployment" "web" {
  metadata {
    name      = "patient-tracker-web"
    namespace = kubernetes_namespace.patient_platform.metadata[0].name
  }
  spec {
    replicas = 2
    selector { match_labels = { app = "patient-tracker-web" } }
    template {
      metadata { labels = { app = "patient-tracker-web" } }
      spec {
        container {
          name              = "web"
          image             = "patient-tracker-web:latest"
          image_pull_policy = "Never"
          port { container_port = 80 }
        }
      }
    }
  }
}

resource "kubernetes_service" "web" {
  metadata {
    name      = "patient-tracker-web"
    namespace = kubernetes_namespace.patient_platform.metadata[0].name
  }
  spec {
    type     = "NodePort"
    selector = { app = "patient-tracker-web" }
    port {
      port        = 80
      target_port = 80
      node_port   = 30080
    }
  }
}
