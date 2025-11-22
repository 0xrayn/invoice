<?php

namespace App\Http\Controllers;

use App\Notifications\CompanyUpdatedNotification;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; // ← ini penting biar Storage bisa dipakai

class CompanyController extends Controller
{
    public function index()
    {
        $this->authorizeAdmin();

        $companies = Company::paginate(20);

        return inertia('Company/Index', [
            'companies' => $companies,
        ]);
    }

    public function create()
    {
        $this->authorizeAdmin();

        return inertia('Company/Create');
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate($this->validationRules());

        if ($request->hasFile('logo_path')) {
            $validated['logo_path'] = $request->file('logo_path')->store('logos', 'public');
        }

        Company::create($validated);

        return redirect()->route('companies.index')
            ->with('success', 'Perusahaan berhasil ditambahkan');
    }

    public function show(Company $company)
    {
        $this->authorizeAdmin();

        return inertia('Company/Show', [
            'company' => $company,
        ]);
    }

    public function edit(Company $company)
    {
        $this->authorizeAdmin();

        return inertia('Company/Edit', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $this->authorizeAdmin();

        $validated = $request->validate($this->validationRules(true));

        if ($request->hasFile('logo_path')) {
            if ($company->logo_path && Storage::disk('public')->exists($company->logo_path)) {
                Storage::disk('public')->delete($company->logo_path);
            }
            $validated['logo_path'] = $request->file('logo_path')->store('logos', 'public');
        } else {
            unset($validated['logo_path']);
        }

        $company->update($validated);
        /** @var \App\Models\User&\Illuminate\Notifications\Notifiable $actor */
        $actor = Auth::user();
        // Actor sendiri
        $actor->notify(new CompanyUpdatedNotification($company, $actor));

        return redirect()->route('companies.index')
            ->with('success', 'Data perusahaan berhasil diperbarui');
    }

    public function destroy(Company $company)
    {
        $this->authorizeAdmin();

        if ($company->logo_path && Storage::disk('public')->exists($company->logo_path)) {
            Storage::disk('public')->delete($company->logo_path);
        }

        $company->delete();

        return redirect()->route('companies.index')
            ->with('success', 'Perusahaan berhasil dihapus');
    }

    private function authorizeAdmin()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user || !$user->isAdmin()) {
            abort(403, 'Hanya admin yang boleh mengelola perusahaan.');
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
            'logo_path'   => 'nullable|file|mimes:jpg,jpeg,png,gif|max:2048',
        ];

        if ($isUpdate) {
            $rules['address'] = 'nullable|string';
        }

        return $rules;
    }
}
