"""create patients table

Revision ID: 001
Revises:
Create Date: 2026-04-13

"""

import sqlalchemy as sa
from alembic import op

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "patients",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("first_name", sa.String(), nullable=False),
        sa.Column("last_name", sa.String(), nullable=False),
        sa.Column("date_of_birth", sa.Date(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=False),
        sa.Column(
            "gender",
            sa.Enum("male", "female", "other", name="genderenum"),
            nullable=False,
        ),
        sa.Column(
            "blood_type",
            sa.Enum("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", name="bloodtypeenum"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_patients_email", "patients", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_patients_email", table_name="patients")
    op.drop_table("patients")
    op.execute("DROP TYPE IF EXISTS genderenum")
    op.execute("DROP TYPE IF EXISTS bloodtypeenum")
