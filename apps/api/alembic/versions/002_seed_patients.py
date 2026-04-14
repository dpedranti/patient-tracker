"""seed patients

Revision ID: 002
Revises: 001
Create Date: 2026-04-13

"""

import sqlalchemy as sa
from alembic import op

revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None

patients_table = sa.table(
    "patients",
    sa.column("first_name", sa.String),
    sa.column("last_name", sa.String),
    sa.column("date_of_birth", sa.Date),
    sa.column("email", sa.String),
    sa.column("phone", sa.String),
    sa.column("gender", sa.String),
    sa.column("blood_type", sa.String),
)

SEED_DATA = [
    {
        "first_name": "Alice",
        "last_name": "Carter",
        "date_of_birth": "1985-03-22",
        "email": "alice.carter@example.com",
        "phone": "(555) 555-0101",
        "gender": "female",
        "blood_type": "A+",
    },
    {
        "first_name": "Brian",
        "last_name": "Nguyen",
        "date_of_birth": "1978-11-04",
        "email": "brian.nguyen@example.com",
        "phone": "(555) 555-0102",
        "gender": "male",
        "blood_type": "O-",
    },
    {
        "first_name": "Carmen",
        "last_name": "Delgado",
        "date_of_birth": "1992-07-18",
        "email": "carmen.delgado@example.com",
        "phone": "(555) 555-0103",
        "gender": "female",
        "blood_type": "B+",
    },
    {
        "first_name": "David",
        "last_name": "Okafor",
        "date_of_birth": "1965-01-30",
        "email": "david.okafor@example.com",
        "phone": "(555) 555-0104",
        "gender": "male",
        "blood_type": "AB+",
    },
    {
        "first_name": "Elena",
        "last_name": "Petrov",
        "date_of_birth": "1990-09-12",
        "email": "elena.petrov@example.com",
        "phone": "(555) 555-0105",
        "gender": "female",
        "blood_type": "A-",
    },
    {
        "first_name": "Felix",
        "last_name": "Huang",
        "date_of_birth": "1983-05-27",
        "email": "felix.huang@example.com",
        "phone": "(555) 555-0106",
        "gender": "male",
        "blood_type": "O+",
    },
    {
        "first_name": "Grace",
        "last_name": "Okonkwo",
        "date_of_birth": "1997-12-09",
        "email": "grace.okonkwo@example.com",
        "phone": "(555) 555-0107",
        "gender": "female",
        "blood_type": "B-",
    },
    {
        "first_name": "Henry",
        "last_name": "Johansson",
        "date_of_birth": "1971-08-14",
        "email": "henry.johansson@example.com",
        "phone": "(555) 555-0108",
        "gender": "male",
        "blood_type": "AB-",
    },
    {
        "first_name": "Imani",
        "last_name": "Washington",
        "date_of_birth": "2001-02-03",
        "email": "imani.washington@example.com",
        "phone": "(555) 555-0109",
        "gender": "other",
        "blood_type": "O+",
    },
    {
        "first_name": "James",
        "last_name": "Moreau",
        "date_of_birth": "1955-06-25",
        "email": "james.moreau@example.com",
        "phone": "(555) 555-0110",
        "gender": "male",
        "blood_type": "A+",
    },
]

SEED_EMAILS = [p["email"] for p in SEED_DATA]


def upgrade() -> None:
    op.bulk_insert(patients_table, SEED_DATA)


def downgrade() -> None:
    op.execute(
        sa.text("DELETE FROM patients WHERE email = ANY(:emails)").bindparams(
            emails=SEED_EMAILS
        )
    )
