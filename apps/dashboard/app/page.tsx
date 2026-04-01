import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirige raíz al dashboard (ajustar según tu lógica de auth)
  redirect('/dashboard');
}
