output "frontend_url" {
  value = "http://localhost:30080"
}
output "namespace" {
  value = kubernetes_namespace.patient_platform.metadata[0].name
}