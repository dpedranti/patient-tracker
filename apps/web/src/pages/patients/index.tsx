import { useState } from 'react';
import { Box, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import { MdAddCircle } from 'react-icons/md';
import type { Patient, PatientCreate } from '../../types/patient';
import { useCreatePatient, useDeletePatient, usePatients, useUpdatePatient } from './use-patients';
import PatientEdit from './edit';
import PatientTable from './list';

export default function PatientsPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const { data: patients = [], isLoading } = usePatients();
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();

  const handleAdd = () => {
    setEditingPatient(null);
    setEditOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setEditOpen(true);
  };

  const handleDelete = (id: number) => {
    deletePatient.mutate(id);
  };

  const handleSave = (data: PatientCreate) => {
    if (editingPatient) {
      updatePatient.mutate({ id: editingPatient.id, data });
    } else {
      createPatient.mutate(data);
    }
    setEditOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1">
          Patients
        </Typography>
        <Tooltip title="Add patient">
          <IconButton color="success" onClick={handleAdd} aria-label="Add patient">
            <MdAddCircle size={32} />
          </IconButton>
        </Tooltip>
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <PatientTable patients={patients} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <PatientEdit
        open={editOpen}
        patient={editingPatient}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
}
