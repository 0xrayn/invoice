<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CustomerController extends Controller
{
    public function index()
    {
        $this->authorizeFinance();

        $customers = Customer::paginate(20);

        return inertia('Customers/Index', [
            'customers' => $customers,
        ]);
    }

    public function create()
    {
        $this->authorizeFinance();

        return inertia('Customers/Create');
    }

    public function store(Request $request)
    {
        $this->authorizeFinance();

        $validated = $request->validate($this->validationRules());

        Customer::create($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Customer berhasil ditambahkan');
    }

    public function show(Customer $customer)
    {
        $this->authorizeFinance();

        return inertia('Customers/Show', [
            'customer' => $customer,
        ]);
    }

    public function edit(Customer $customer)
    {
        $this->authorizeFinance();

        return inertia('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $this->authorizeFinance();

        $validated = $request->validate($this->validationRules(true));

        $customer->update($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Data customer berhasil diperbarui');
    }

    public function destroy(Customer $customer)
    {
        $this->authorizeFinance();

        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'Customer berhasil dihapus');
    }

    private function authorizeFinance()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user || !$user->isFinance()) {
            abort(403, 'Hanya Finance yang boleh mengelola customer.');
        }
    }

    private function validationRules($isUpdate = false): array
    {
        $rules = [
            'name'        => 'required|string|max:255',
            'address'     => 'nullable|string|max:255',
            'city'        => 'nullable|regex:/^[a-zA-Z\s]+$/|max:255',
            'province'    => 'nullable|regex:/^[a-zA-Z\s]+$/|max:255',
            'postal_code' => 'nullable|regex:/^[0-9]+$/|max:10',
            'country'     => 'nullable|string|max:100',
            'phone'       => ['nullable', 'regex:/^(0|62)[0-9]{8,13}$/'],
            'email'       => 'nullable|email|max:255',
        ];

        if ($isUpdate) {
            $rules['address'] = 'nullable|string';
        }

        return $rules;
    }
}
