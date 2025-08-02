import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

describe('Navbar', () => {
  it('renders site name', () => {
    render(<Navbar />);
    expect(screen.getByText('Raju Raj')).toBeInTheDocument();
  });
});
