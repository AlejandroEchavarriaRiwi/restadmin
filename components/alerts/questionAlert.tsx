'use client'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

async function AlertConfirm(message: string) {
    return MySwal.fire({
        title: "Estas seguro?",
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: 'Si, estoy seguro!',
    });
}

export { AlertConfirm }

