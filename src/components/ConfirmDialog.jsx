import Swal from 'sweetalert2';

export async function confirmDelete() {
  const result = await Swal.fire({
    title: 'Delete Product?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    reverseButtons: true
  });

  return result.isConfirmed;
}

export default function ConfirmDialog() {
  return null;
}
