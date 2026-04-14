export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  blood_type: BloodType;
  created_at: string;
  updated_at: string;
}

export type PatientCreate = Omit<Patient, 'id' | 'created_at' | 'updated_at'>;
export type PatientUpdate = Partial<PatientCreate>;
