import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Link,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { IoFemale, IoMale, IoPerson, IoTrashOutline, IoTransgender } from 'react-icons/io5';
import { MdCake, MdCreate, MdEmail, MdPhone } from 'react-icons/md';
import type { Patient } from '../../types/patient';

const GENDER_ICONS: Record<Patient['gender'], React.ReactElement> = {
  male: <IoMale size={16} />,
  female: <IoFemale size={16} />,
  other: <IoTransgender size={16} />,
};

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
}

export default function PatientTable({ patients, onEdit, onDelete }: PatientTableProps) {
  const [confirmAnchor, setConfirmAnchor] = useState<HTMLButtonElement | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setConfirmAnchor(e.currentTarget);
    setPendingDeleteId(id);
  };

  const handleConfirm = () => {
    if (pendingDeleteId !== null) onDelete(pendingDeleteId);
    setConfirmAnchor(null);
    setPendingDeleteId(null);
  };

  const handleCancel = () => {
    setConfirmAnchor(null);
    setPendingDeleteId(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="Patients Table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Birth Sex</TableCell>
              <TableCell>Blood Type</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id} hover>
                <TableCell>
                  <Link
                    component="button"
                    onClick={() => onEdit(patient)}
                    underline="hover"
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',

                      gap: 1,
                      textAlign: 'left',
                    }}
                  >
                    <IoPerson size={20} style={{ flexShrink: 0 }} />
                    {patient.first_name} {patient.last_name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <MdCake size={18} />
                    {dayjs(patient.date_of_birth).format('MM/DD/YYYY')}
                  </Box>
                </TableCell>
                <TableCell>
                  <Link
                    href={`mailto:${patient.email}`}
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                  >
                    <MdEmail size={18} />
                    {patient.email}
                  </Link>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Link
                    href={`tel:${patient.phone}`}
                    underline="hover"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                  >
                    <MdPhone size={18} />
                    {patient.phone}
                  </Link>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      textTransform: 'capitalize',
                    }}
                  >
                    {GENDER_ICONS[patient.gender]}
                    {patient.gender}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={patient.blood_type}
                    color="error"
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                  <Tooltip title="Edit">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => onEdit(patient)}
                      aria-label={`Edit ${patient.first_name} ${patient.last_name}`}
                    >
                      <MdCreate size={24} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={(e) => handleDeleteClick(e, patient.id)}
                      aria-label={`Delete ${patient.first_name} ${patient.last_name}`}
                    >
                      <IoTrashOutline size={24} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Popover
        open={Boolean(confirmAnchor)}
        anchorEl={confirmAnchor}
        onClose={handleCancel}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="body2">Delete this patient?</Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button size="small" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="small" variant="contained" color="error" onClick={handleConfirm}>
              Delete
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
