import styled from 'styled-components';

const Button = styled.button<{ $disabled?: boolean; $variant?: 'primary' | 'secondary' | 'danger' | 'alert' }>`
  padding: 10px 20px;
  background-color: ${props => {
    if (props.$disabled) return "#cccccc";
    switch(props.$variant) {
      case 'secondary': return "#6c757d";
      case 'danger': return "#dc3545";
      case 'alert': return "#ecc133";
      default: return "#637AD6";
    }
  }};
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.$disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => {
      if (props.$disabled) return "#cccccc";
      switch(props.$variant) {
        case 'secondary': return "#5a6268";
        case 'danger': return "#c82333";
        case 'alert': return "#e8b613";
        default: return "#4655C4";
      }
    }};
  }
`;

export default Button;