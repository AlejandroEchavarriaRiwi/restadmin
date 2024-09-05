// InputAlert.tsx
import Swal from 'sweetalert2';

const SubmitAlert = (message: string, type: "success" | "error", onClose: () => void) => {
    Swal.fire({
        title: message,
        icon: type,
        confirmButtonText: 'OK',
    }).then((result) => {
        if (result.isConfirmed) {
            // Llamamos al callback `onClose` cuando el usuario pulsa OK
            onClose();
        }
    });
};

export default SubmitAlert;
