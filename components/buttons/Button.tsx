import styled from 'styled-components';

const Button = styled.button<{ $disabled?: boolean; $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 20px;
  background-color: ${props => {
    if (props.$disabled) return "#cccccc";
    switch(props.$variant) {
      case 'secondary': return "#6c757d";
      case 'danger': return "#dc3545";
      default: return "#007bff";
    }
  }};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.$disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s;
  margin: 0 5px;

  &:hover {
    background-color: ${props => {
      if (props.$disabled) return "#cccccc";
      switch(props.$variant) {
        case 'secondary': return "#5a6268";
        case 'danger': return "#c82333";
        default: return "#0056b3";
      }
    }};
  }
`;

export default Button;