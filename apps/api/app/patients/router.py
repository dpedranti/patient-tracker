from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.patients import service
from app.patients.schemas import PatientCreate, PatientResponse, PatientUpdate

router = APIRouter()


@router.get("", response_model=list[PatientResponse])
def list_patients(db: Session = Depends(get_db)):
    return service.get_patients(db)


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    return service.get_patient(db, patient_id)


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(data: PatientCreate, db: Session = Depends(get_db)):
    return service.create_patient(db, data)


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: int, data: PatientUpdate, db: Session = Depends(get_db)):
    return service.update_patient(db, patient_id, data)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    service.delete_patient(db, patient_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
