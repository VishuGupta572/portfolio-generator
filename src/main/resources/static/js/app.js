/**
 * Portfolio Frontend Application
 * Interacts with Spring Boot ProfileController endpoints:
 * - POST /addProfile
 * - GET  /getallprofiles
 * - GET  /findByfullNameAndId
 * - DELETE /DeleteByfullNameAndId
 */

const API_BASE = ''; // Same-origin when served from Spring Boot, or configure host if separate

document.addEventListener('DOMContentLoaded', () => {
    init();
});

let allProfiles = [];

function init() {
    setupEventListeners();
    loadAllProfiles();
}

function setupEventListeners() {
    // Add Profile Form
    const addProfileForm = document.getElementById('addProfileForm');
    if (addProfileForm) {
        addProfileForm.addEventListener('submit', handleAddProfile);
    }

    // Search Profile Form
    const searchProfileForm = document.getElementById('searchProfileForm');
    if (searchProfileForm) {
        searchProfileForm.addEventListener('submit', handleSearchProfile);
    }

    // Modal Triggers
    const openAddModalBtn = document.getElementById('openAddModalBtn');
    const addProfileModal = document.getElementById('addProfileModal');
    const closeAddModal = document.getElementById('closeAddModal');

    if (openAddModalBtn && addProfileModal) {
        openAddModalBtn.addEventListener('click', () => {
            addProfileModal.classList.add('active');
        });
    }

    if (closeAddModal && addProfileModal) {
        closeAddModal.addEventListener('click', () => {
            addProfileModal.classList.remove('active');
        });
    }

    const openSearchModalBtn = document.getElementById('openSearchModalBtn');
    const searchProfileModal = document.getElementById('searchProfileModal');
    const closeSearchModal = document.getElementById('closeSearchModal');

    if (openSearchModalBtn && searchProfileModal) {
        openSearchModalBtn.addEventListener('click', () => {
            searchProfileModal.classList.add('active');
        });
    }

    if (closeSearchModal && searchProfileModal) {
        closeSearchModal.addEventListener('click', () => {
            searchProfileModal.classList.remove('active');
        });
    }

    // Close on background click
    [addProfileModal, searchProfileModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }
    });
}

// Fetch all profiles via GET /getallprofiles
async function loadAllProfiles() {
    const listContainer = document.getElementById('profilesList');
    if (listContainer) {
        listContainer.innerHTML = '<p style="color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading profiles...</p>';
    }

    try {
        const response = await fetch(`${API_BASE}/getallprofiles`);
        if (!response.ok) throw new Error('Failed to load profiles');
        allProfiles = await response.json();

        if (allProfiles.length > 0) {
            // Display first profile in Hero
            renderHeroProfile(allProfiles[0]);
        } else {
            renderHeroDefault();
        }

        renderProfilesList(allProfiles);
    } catch (err) {
        console.error('Error fetching profiles:', err);
        if (listContainer) {
            listContainer.innerHTML = '<p style="color: var(--text-dim);">No profiles loaded. Add one using the "Add Profile" button!</p>';
        }
    }
}

// Render primary profile in Hero section
function renderHeroProfile(profile) {
    if (!profile) return;

    setElemText('heroFullName', profile.fullName || 'Developer');
    setElemText('heroHeadline', profile.headline || 'Full Stack Engineer');
    setElemText('heroBio', profile.bio || 'Welcome to my portfolio website.');
    setElemText('heroEmail', profile.email || 'N/A');
    setElemText('heroPhone', profile.phoneNumber || 'N/A');
    setElemText('heroLocation', profile.location || 'Remote');

    // Initials
    const name = profile.fullName || 'D';
    const parts = name.trim().split(' ');
    const initials = parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();
    setElemText('heroInitials', initials);

    // Links
    const resumeBtn = document.getElementById('heroResumeBtn');
    if (resumeBtn) {
        resumeBtn.href = profile.resumeUrl || '#';
        resumeBtn.style.display = profile.resumeUrl ? 'inline-flex' : 'none';
    }

    const githubBtn = document.getElementById('heroGithubBtn');
    if (githubBtn) {
        githubBtn.href = profile.githubUrl || '#';
        githubBtn.style.display = profile.githubUrl ? 'inline-flex' : 'none';
    }

    const linkedinBtn = document.getElementById('heroLinkedinBtn');
    if (linkedinBtn) {
        linkedinBtn.href = profile.linkedinUrl || '#';
        linkedinBtn.style.display = profile.linkedinUrl ? 'inline-flex' : 'none';
    }
}

function renderHeroDefault() {
    setElemText('heroFullName', 'Your Name');
    setElemText('heroHeadline', 'Full Stack Developer');
    setElemText('heroBio', 'No profile added yet. Click "Add Profile" above to create your portfolio profile!');
    setElemText('heroEmail', 'example@domain.com');
    setElemText('heroPhone', '+1 000 000 0000');
    setElemText('heroLocation', 'City, Country');
    setElemText('heroInitials', 'DEV');
}

// Render profiles cards list
function renderProfilesList(profiles) {
    const container = document.getElementById('profilesList');
    if (!container) return;

    if (profiles.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: 16px;">
                <p style="color: var(--text-muted); margin-bottom: 16px;">No profiles found in database.</p>
                <button class="btn btn-primary" onclick="document.getElementById('addProfileModal').classList.add('active')">
                    <i class="fa-solid fa-plus"></i> Add First Profile
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = profiles.map(p => `
        <div class="profile-card">
            <div class="profile-card-header">
                <div>
                    <h3 class="profile-card-name">${escapeHtml(p.fullName || 'Untitled')}</h3>
                    <div class="profile-card-headline">${escapeHtml(p.headline || '')}</div>
                </div>
                <span class="profile-id-badge">ID: ${p.id}</span>
            </div>
            <p class="profile-card-bio">${escapeHtml(p.bio || 'No bio provided.')}</p>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px; display: flex; flex-direction: column; gap: 4px;">
                ${p.email ? `<div><i class="fa-solid fa-envelope" style="color: var(--secondary);"></i> ${escapeHtml(p.email)}</div>` : ''}
                ${p.location ? `<div><i class="fa-solid fa-location-dot" style="color: var(--secondary);"></i> ${escapeHtml(p.location)}</div>` : ''}
            </div>
            <div class="profile-card-footer">
                <button class="btn btn-secondary btn-sm" onclick="selectPrimaryProfile(${p.id})">
                    <i class="fa-solid fa-eye"></i> View
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProfile('${escapeHtml(p.fullName)}', ${p.id})">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

window.selectPrimaryProfile = function(id) {
    const profile = allProfiles.find(p => p.id === id);
    if (profile) {
        renderHeroProfile(profile);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(`Viewing ${profile.fullName}`, 'success');
    }
};

// Handle POST /addProfile
async function handleAddProfile(e) {
    e.preventDefault();
    const btn = document.getElementById('submitAddProfileBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    const idInput = document.getElementById('addProfileId').value.trim();
    const payload = {
        id: idInput ? parseInt(idInput) : null,
        fullName: document.getElementById('addFullName').value.trim(),
        headline: document.getElementById('addHeadline').value.trim(),
        bio: document.getElementById('addBio').value.trim(),
        email: document.getElementById('addEmail').value.trim(),
        phoneNumber: document.getElementById('addPhone').value.trim(),
        location: document.getElementById('addLocation').value.trim(),
        resumeUrl: document.getElementById('addResumeUrl').value.trim(),
        githubUrl: document.getElementById('addGithubUrl').value.trim(),
        linkedinUrl: document.getElementById('addLinkedinUrl').value.trim()
    };

    try {
        const response = await fetch(`${API_BASE}/addProfile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const msg = await response.text();
        if (!response.ok) {
            throw new Error(msg || 'Failed to add profile');
        }

        showToast(msg || 'Profile saved successfully!', 'success');
        document.getElementById('addProfileForm').reset();
        document.getElementById('addProfileModal').classList.remove('active');
        await loadAllProfiles();
    } catch (err) {
        console.error('Add Profile error:', err);
        showToast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// Handle GET /findByfullNameAndId
async function handleSearchProfile(e) {
    e.preventDefault();
    const fullName = document.getElementById('searchFullName').value.trim();
    const id = document.getElementById('searchId').value.trim();
    const resultBox = document.getElementById('searchResultBox');

    if (!fullName || !id) {
        showToast('Please enter both Full Name and ID', 'error');
        return;
    }

    resultBox.innerHTML = '<p style="color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Searching...</p>';

    try {
        const url = `${API_BASE}/findByfullNameAndId?fullName=${encodeURIComponent(fullName)}&id=${encodeURIComponent(id)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Profile not found');
        const profile = await response.json();

        if (profile && profile.fullName) {
            resultBox.innerHTML = `
                <div class="profile-card" style="margin-top: 16px;">
                    <div class="profile-card-header">
                        <div>
                            <h3 class="profile-card-name">${escapeHtml(profile.fullName)}</h3>
                            <div class="profile-card-headline">${escapeHtml(profile.headline || '')}</div>
                        </div>
                        <span class="profile-id-badge">ID: ${profile.id}</span>
                    </div>
                    <p class="profile-card-bio">${escapeHtml(profile.bio || '')}</p>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
                        <div><i class="fa-solid fa-envelope"></i> ${escapeHtml(profile.email || 'N/A')}</div>
                        <div><i class="fa-solid fa-location-dot"></i> ${escapeHtml(profile.location || 'N/A')}</div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="selectPrimaryProfile(${profile.id}); document.getElementById('searchProfileModal').classList.remove('active');">
                        <i class="fa-solid fa-check"></i> Display on Portfolio
                    </button>
                </div>
            `;
        } else {
            resultBox.innerHTML = '<p style="color: var(--danger); margin-top: 16px;">No profile found matching name and ID.</p>';
        }
    } catch (err) {
        console.error('Search error:', err);
        resultBox.innerHTML = '<p style="color: var(--danger); margin-top: 16px;">Profile not found.</p>';
    }
}

// Handle DELETE /DeleteByfullNameAndId
window.deleteProfile = async function(fullName, id) {
    if (!confirm(`Are you sure you want to delete profile "${fullName}" (ID: ${id})?`)) {
        return;
    }

    try {
        const url = `${API_BASE}/DeleteByfullNameAndId/${encodeURIComponent(fullName)}?id=${encodeURIComponent(id)}`;
        const response = await fetch(url, { method: 'DELETE' });
        const text = await response.text();

        showToast(text || 'Profile deleted successfully', 'success');
        await loadAllProfiles();
    } catch (err) {
        console.error('Delete error:', err);
        showToast('Error deleting profile', 'error');
    }
};

// Utilities
function setElemText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastWrap');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerHTML = `<i class="${type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}"></i> ${escapeHtml(message)}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
