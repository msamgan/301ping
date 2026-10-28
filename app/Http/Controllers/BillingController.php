<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Paddle\Transaction;

class BillingController extends Controller
{
    public function index(Request $request): Response
    {
        $invoices = $request->user()->transactions()
            ->whereNotNull('invoice_number')
            ->get()
            ->map(fn (Transaction $transaction) => [
                'id' => $transaction->id,
                'number' => $transaction->invoice_number,
                'date' => $transaction->billed_at?->toFormattedDateString(),
                'status' => $transaction->status,
                'total' => $transaction->total(),
            ]);

        return Inertia::render('Billing', [
            'invoices' => $invoices,
        ]);
    }

    public function downloadInvoice(Request $request, string $transaction): RedirectResponse
    {
        $transaction = $request->user()->transactions()->findOrFail($transaction);
        $invoiceUrl = $transaction->invoicePdf();

        abort_if(! $invoiceUrl, 404, 'Invoice PDF is not available.');

        return redirect()->away($invoiceUrl);
    }
}
