<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Paragraph extends Model
{
    protected $fillable = [
        'page_id',
        'content',
        'order',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
