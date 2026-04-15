variable "postgres_db"   { default = "patient_tracker" }
variable "postgres_user" { default = "patient_user" }
variable "postgres_password" {
  sensitive = true
}
