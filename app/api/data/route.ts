import { NextResponse } from 'next/server';
import { generateInitialDataset } from '../../../lib/dataGenerator';

export async function GET(){
  const initial = generateInitialDataset(12000);
  return NextResponse.json({ data: initial });
}