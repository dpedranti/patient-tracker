from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.patients.models import BloodTypeEnum, GenderEnum


class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    email: str
    phone: str
    gender: GenderEnum
    blood_type: BloodTypeEnum


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[GenderEnum] = None
    blood_type: Optional[BloodTypeEnum] = None


class PatientResponse(PatientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
