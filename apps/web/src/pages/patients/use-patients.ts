import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Patient, PatientCreate, PatientUpdate } from '../../types/patient';

const API_BASE = '/api/patients';

async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch patients');
  return res.json();
}

async function fetchPatient(id: number): Promise<Patient> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Patient not found');
  return res.json();
}

async function createPatient(data: PatientCreate): Promise<Patient> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create patient');
  return res.json();
}

async function updatePatient(id: number, data: PatientUpdate): Promise<Patient> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update patient');
  return res.json();
}

async function deletePatient(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete patient');
}

export function usePatients() {
  return useQuery({ queryKey: ['patients'], queryFn: fetchPatients });
}

export function usePatient(id: number) {
  return useQuery({ queryKey: ['patients', id], queryFn: () => fetchPatient(id) });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatientUpdate }) => updatePatient(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePatient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });
}
