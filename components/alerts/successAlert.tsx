'use client'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function InputAlert(message: string, p0: string, p1: () => void, type: 'success' | 'error') {
    return MySwal.fire({
        title: <i>{message}</i>,
        icon: type,
        confirmButtonText: 'OK'
    });
}