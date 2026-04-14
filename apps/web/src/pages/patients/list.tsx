import {
  Box,
  Chip,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import dayjs from 'dayjs';
import { IoFemale, IoMale, IoTrashOutline, IoTransgender } from 'react-icons/io5';
import { MdCreate } from 'react-icons/md';
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
  return (
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
                  sx={{ cursor: 'pointer' }}
                >
                  {patient.first_name} {patient.last_name}
                </Link>
              </TableCell>
              <TableCell>{dayjs(patient.date_of_birth).format('MM/DD/YYYY')}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{patient.phone}</TableCell>
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
                    onClick={() => onDelete(patient.id)}
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
  );
}
