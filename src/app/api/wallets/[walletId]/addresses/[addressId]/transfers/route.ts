import { getSeed } from '@/app/db/db';
import { Wallet } from '@coinbase/coinbase-sdk';
import { NextResponse } from 'next/server';
import  '@/lib/server/coinbase';

export async function POST(request: Request, { params }: { params: { walletId: string, addressId: string } }) {
    try {
      const body = await request.json();
      const { destination_address, amount, asset } = body;

      // Validate required fields
      if (!params.addressId) {
          return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
      }

      if (!params.walletId){
          return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 });
      }
      if (!destination_address) {
        return NextResponse.json({ error: 'Destination address is required' }, { status: 400 });
      }
      if (!amount) {
        return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
      }
      if (!asset) {
        return NextResponse.json({ error: 'Asset is required' }, { status: 400 });
      }
  
      // Validate amount is a positive number
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
      }
    
      const wallet = await Wallet.fetch(params.walletId);

      const walletId = wallet.getId() as string;
  
      const seed = await getSeed(walletId, process.env.ENCRYPTION_KEY as string);
  
      wallet.setSeed(seed as string);

        // Get the address object
        const addresses = await wallet.listAddresses()

        const address = addresses.find(addr => addr.getId() === params.addressId);

        if (!address) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }

        const transfer = await address.createTransfer({
        amount: numAmount,
        assetId: asset,
        destination: destination_address,
     });

     await transfer.wait();

    if (transfer.getStatus() === 'complete') {
        console.log(`Transfer successfully completed: `, transfer.toString());
    } else {
        return NextResponse.json({
            success: false,
            error: 'transaction not complete'
        }, {status: 500 });
    }
  
      return NextResponse.json({
          success: true,
          transactionLink: transfer.getTransactionLink() as string,
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating transfer request:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }