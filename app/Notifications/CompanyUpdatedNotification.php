<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Company;

class CompanyUpdatedNotification extends Notification
{
    use Queueable;

    protected $company;
    protected $updatedBy;

    public function __construct(Company $company, $updatedBy)
    {
        $this->company = $company;
        $this->updatedBy = $updatedBy;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Company Updated',
            'message' => "Company '{$this->company->name}' telah diupdate.",
            'company_id' => $this->company->id,
            'type' => 'company_updated',
            'updated_by' => $this->updatedBy->name,
            'url' => route('companies.show', $this->company->id),
        ];
    }
}
