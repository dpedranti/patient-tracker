import { forwardRef, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import type { BloodType, Patient, PatientCreate } from '../../types/patient';

const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] satisfies BloodType[];

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

interface PatientEditProps {
  open: boolean;
  patient: Patient | null;
  onClose: () => void;
  onSave: (data: PatientCreate) => void;
}

const defaultForm: PatientCreate = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  email: '',
  phone: '',
  gender: 'male',
  blood_type: 'O+',
};

export default function PatientEdit({ open, patient, onClose, onSave }: PatientEditProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientCreate>({ defaultValues: defaultForm });

  useEffect(() => {
    if (open) {
      reset(patient ?? defaultForm);
    }
  }, [open, patient, reset]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={SlideUp}
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle>{patient ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
      <DialogContent>
        <Box
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, pt: 1 }}
        >
          <TextField
            label="First Name"
            {...register('first_name', { required: 'First name is required' })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            required
            fullWidth
          />
          <TextField
            label="Last Name"
            {...register('last_name', { required: 'Last name is required' })}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            required
            fullWidth
          />
          <TextField
            label="Date of Birth"
            type="date"
            {...register('date_of_birth', { required: 'Date of birth is required' })}
            error={!!errors.date_of_birth}
            helperText={errors.date_of_birth?.message}
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'Birth Sex is required' }}
            render={({ field }) => (
              <FormControl fullWidth required error={!!errors.gender}>
                <InputLabel>Birth Sex</InputLabel>
                <Select {...field} label="Birth Sex">
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <TextField
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            required
            fullWidth
          />
          <Controller
            name="phone"
            control={control}
            rules={{
              required: 'Phone is required',
              pattern: {
                value: /^\(\d{3}\) \d{3}-\d{4}$/,
                message: 'Enter a complete phone number',
              },
            }}
            render={({ field: { onChange, value, ref } }) => (
              <TextField
                label="Phone"
                type="tel"
                value={value}
                onChange={(e) => onChange(formatPhone(e.target.value))}
                inputRef={ref}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="blood_type"
            control={control}
            rules={{ required: 'Blood type is required' }}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                options={BLOOD_TYPES}
                value={value}
                onChange={(_e, newValue) => onChange(newValue)}
                disableClearable
                fullWidth
                sx={{ gridColumn: '1 / -1' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Blood Type"
                    required
                    error={!!errors.blood_type}
                    helperText={errors.blood_type?.message}
                  />
                )}
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSave)} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
