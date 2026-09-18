import { notFound } from 'next/navigation';
import VisualFixture from '../../../tests/VisualFixture';
export default function Page() { if (process.env.NODE_ENV !== 'development') notFound(); return <VisualFixture/>; }
