import { render, screen, fireEvent } from '@testing-library/react';
import PatientsPage from '.';

describe('PatientsPage', () => {
  it('renders the page heading and patient table with mock data', () => {
    render(<PatientsPage />);
    expect(
      screen.getByRole('heading', { name: 'Patients' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Johnson')).toBeInTheDocument();
    expect(screen.getByText('alice.johnson@example.com')).toBeInTheDocument();
  });

  it('opens add dialog when clicking the add button', () => {
    render(<PatientsPage />);
    fireEvent.click(screen.getByLabelText('Add patient'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add Patient')).toBeInTheDocument();
  });

  it('opens edit dialog pre-filled when clicking edit for a patient', () => {
    render(<PatientsPage />);
    fireEvent.click(screen.getByLabelText('Edit Alice Johnson'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Edit Patient')).toBeInTheDocument();
  });

  it('closes the dialog when Cancel is clicked', () => {
    render(<PatientsPage />);
    fireEvent.click(screen.getByLabelText('Add patient'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('removes a patient from the table when the delete button is clicked', () => {
    render(<PatientsPage />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Delete Alice Johnson'));
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(
      screen.queryByText('alice.johnson@example.com'),
    ).not.toBeInTheDocument();
  });
});
