/**
 * =========================================================
 * VISHU GUPTA - PORTFOLIO WEB APPLICATION
 * Clean Frontend Integrations with Spring Boot Backend
 * REST Endpoints:
 *   - ProfileController:
 *       POST   /addProfile
 *       GET    /getallprofiles
 *       GET    /findByfullNameAndId?fullName=...&id=...
 *       DELETE /DeleteByfullNameAndId/{fullName}/{id}
 *   - ProjectController:
 *       POST   /addProjects
 *       GET    /getallprojects
 *       DELETE /DeleteById/{id}
 * =========================================================
 */

const API_BASE = '';

let allProfiles = [];
let allProjects = [];

// Fallback profile details for Vishu Gupta when DB has no profiles
const DEFAULT_VISHU_PROFILE = {
    fullName: "Vishu Gupta",
    headline: "Software Engineer | Backend & AI/ML Enthusiast",
    bio: "Driven Software Engineer with strong foundations in Java, Spring Boot microservices, and relational database systems. Focused on building resilient backend architectures, optimizing API performance, and exploring Machine Learning pipelines.",
    email: "vishugupta@example.com",
    phoneNumber: "+91 XXXXXXXXXX",
    location: "India",
    resumeUrl: "",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com"
};

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupNavigation();
    setupEventListeners();
    loadAllProfiles();
    loadAllProjects();
    loadSavedSkills();
}

/**
 * Navigation, mobile menu toggle, and smooth active states
 */
function setupNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close mobile nav when clicking any nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // Active state highlighting during scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id], header[id]');
        const scrollY = window.pageYOffset + 120;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');
            const navAnchor = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

            if (navAnchor) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navAnchor.classList.add('active');
                } else {
                    navAnchor.classList.remove('active');
                }
            }
        });
    });
}

function setupEventListeners() {
    // Add Profile Form (POST /addProfile)
    const addProfileForm = document.getElementById('addProfileForm');
    if (addProfileForm) {
        addProfileForm.addEventListener('submit', handleAddProfile);
    }

    // Search Profile Form (GET /findByfullNameAndId)
    const searchProfileForm = document.getElementById('searchProfileForm');
    if (searchProfileForm) {
        searchProfileForm.addEventListener('submit', handleSearchProfile);
    }

    // Add Project Form (POST /addProjects)
    const addProjectForm = document.getElementById('addProjectForm');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', handleAddProject);
    }

    // Update Project Form (PUT /UpadateProjects/{title})
    const updateProjectForm = document.getElementById('updateProjectForm');
    if (updateProjectForm) {
        updateProjectForm.addEventListener('submit', handleUpdateProject);
    }

    // Search Project Form (GET /getprojectBytitle)
    const searchProjectForm = document.getElementById('searchProjectForm');
    if (searchProjectForm) {
        searchProjectForm.addEventListener('submit', handleSearchProject);
    }

    // Add Skill Form (POST /addSkills)
    const addSkillForm = document.getElementById('addSkillForm');
    if (addSkillForm) {
        addSkillForm.addEventListener('submit', handleAddSkill);
    }

    // Update Profile Form (PUT /upadateprofile/{id})
    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', handleUpdateProfile);
    }

    // Contact Quick Form (Direct mailto trigger)
    const contactQuickForm = document.getElementById('contactQuickForm');
    if (contactQuickForm) {
        contactQuickForm.addEventListener('submit', handleQuickEmailSubmit);
    }

    // Copy Contact Message Button
    const copyMessageBtn = document.getElementById('copyMessageBtn');
    if (copyMessageBtn) {
        copyMessageBtn.addEventListener('click', handleCopyMessage);
    }

    // Modals Wiring
    setupModal('openAddProfileModalBtn', 'addProfileModal', 'closeAddProfileModal');
    setupModal('openSearchProfileModalBtn', 'searchProfileModal', 'closeSearchProfileModal');
    setupModal(null, 'updateProfileModal', 'closeUpdateProfileModal');
    setupModal('openAddProjectModalBtn', 'addProjectModal', 'closeAddProjectModal');
    setupModal('openSearchProjectModalBtn', 'searchProjectModal', 'closeSearchProjectModal');
    setupModal(null, 'updateProjectModal', 'closeUpdateProjectModal');
    setupModal('openAddSkillModalBtn', 'addSkillModal', 'closeAddSkillModal');
    setupModal('openAddSkillSectionBtn', 'addSkillModal', 'closeAddSkillModal');
}

function setupModal(openBtnId, modalId, closeBtnId) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            // Auto-focus first input
            const firstInput = modal.querySelector('input, textarea');
            if (firstInput) setTimeout(() => firstInput.focus(), 100);
        });
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
}

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
});

// =========================================================
// PROFILES API INTEGRATION
// =========================================================

/**
 * Fetch all profiles via GET /getallprofiles
 */
async function loadAllProfiles() {
    const listContainer = document.getElementById('profilesList');
    if (listContainer) {
        listContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-dim);">
                <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--secondary); margin-bottom: 12px;"></i>
                <p>Retrieving profiles from Spring Boot...</p>
            </div>
        `;
    }

    try {
        const response = await fetch(`${API_BASE}/getallprofiles`);
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to load profiles`);
        allProfiles = await response.json();

        if (allProfiles && allProfiles.length > 0) {
            renderHeroProfile(allProfiles[0]);
        } else {
            renderHeroProfile(DEFAULT_VISHU_PROFILE);
        }

        renderProfilesList(allProfiles);
    } catch (err) {
        console.warn('Profiles load error (using fallback):', err);
        renderHeroProfile(DEFAULT_VISHU_PROFILE);
        if (listContainer) {
            listContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 36px; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
                    <p style="color: var(--text-low); margin-bottom: 12px;">No saved profiles in the database yet.</p>
                    <button class="btn btn-primary btn-sm" onclick="document.getElementById('addProfileModal').classList.add('active')">
                        <i class="fa-solid fa-plus"></i> Add First Profile
                    </button>
                </div>
            `;
        }
    }
}

/**
 * Populates the Hero & Contact section with the active profile
 */
function renderHeroProfile(profile) {
    if (!profile) return;

    setElemText('heroFullName', profile.fullName || DEFAULT_VISHU_PROFILE.fullName);
    setElemText('heroHeadline', profile.headline || DEFAULT_VISHU_PROFILE.headline);
    setElemText('heroBio', profile.bio || DEFAULT_VISHU_PROFILE.bio);
    setElemText('heroEmail', profile.email || DEFAULT_VISHU_PROFILE.email);
    setElemText('heroPhone', profile.phoneNumber || DEFAULT_VISHU_PROFILE.phoneNumber);
    setElemText('heroLocation', profile.location || DEFAULT_VISHU_PROFILE.location);

    // Compute initials for terminal preview
    const name = (profile.fullName || DEFAULT_VISHU_PROFILE.fullName).trim();
    const parts = name.split(/\s+/);
    const initials = parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();
    setElemText('heroInitials', initials);

    // Resume button
    const resumeBtn = document.getElementById('heroResumeBtn');
    if (resumeBtn) {
        if (profile.resumeUrl && profile.resumeUrl.trim()) {
            resumeBtn.href = profile.resumeUrl;
            resumeBtn.style.display = 'inline-flex';
        } else {
            resumeBtn.style.display = 'none';
        }
    }

    // GitHub button
    const githubBtn = document.getElementById('heroGithubBtn');
    if (githubBtn) {
        const ghUrl = profile.githubUrl || 'https://github.com';
        githubBtn.href = ghUrl;
        githubBtn.style.display = 'inline-flex';
    }

    // LinkedIn button
    const linkedinBtn = document.getElementById('heroLinkedinBtn');
    if (linkedinBtn) {
        const liUrl = profile.linkedinUrl || 'https://linkedin.com';
        linkedinBtn.href = liUrl;
        linkedinBtn.style.display = 'inline-flex';
    }

    // Sync Contact Section values
    const contactEmailVal = document.getElementById('contactEmailVal');
    const directEmailLink = document.getElementById('directEmailLink');
    if (contactEmailVal) {
        contactEmailVal.textContent = profile.email || DEFAULT_VISHU_PROFILE.email;
    }
    if (directEmailLink) {
        directEmailLink.href = `mailto:${profile.email || DEFAULT_VISHU_PROFILE.email}`;
    }

    const contactLocationVal = document.getElementById('contactLocationVal');
    if (contactLocationVal) {
        contactLocationVal.textContent = (profile.location || DEFAULT_VISHU_PROFILE.location) + ' • Open to Remote';
    }

    const directGithubLink = document.getElementById('directGithubLink');
    if (directGithubLink && profile.githubUrl) {
        directGithubLink.href = profile.githubUrl;
    }

    const directLinkedinLink = document.getElementById('directLinkedinLink');
    if (directLinkedinLink && profile.linkedinUrl) {
        directLinkedinLink.href = profile.linkedinUrl;
    }
}

/**
 * Render Profiles list cards
 */
function renderProfilesList(profiles) {
    const container = document.getElementById('profilesList');
    if (!container) return;

    if (!profiles || profiles.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 44px; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
                <p style="color: var(--text-mid); margin-bottom: 14px;">No profiles found in the database.</p>
                <button class="btn btn-primary btn-sm" onclick="document.getElementById('addProfileModal').classList.add('active')">
                    <i class="fa-solid fa-user-plus"></i> Add New Profile
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = profiles.map(p => {
        const escapedName = escapeHtml(p.fullName || 'Untitled');
        const escapedHeadline = escapeHtml(p.headline || '');
        const escapedBio = escapeHtml(p.bio || 'No bio specified.');
        const escapedEmail = escapeHtml(p.email || '');
        const escapedLocation = escapeHtml(p.location || '');
        const escapedPhone = escapeHtml(p.phoneNumber || '');

        return `
            <div class="profile-card">
                <div class="profile-card-header">
                    <div>
                        <h3 class="profile-card-name">${escapedName}</h3>
                        <div class="profile-card-headline">${escapedHeadline}</div>
                    </div>
                    <span class="profile-id-chip">ID: ${p.id}</span>
                </div>

                <p class="profile-card-bio">${escapedBio}</p>

                <div class="profile-card-info-list">
                    ${escapedEmail ? `<div><i class="fa-solid fa-envelope" style="color: var(--secondary); margin-right: 6px;"></i> ${escapedEmail}</div>` : ''}
                    ${escapedPhone ? `<div><i class="fa-solid fa-phone" style="color: var(--secondary); margin-right: 6px;"></i> ${escapedPhone}</div>` : ''}
                    ${escapedLocation ? `<div><i class="fa-solid fa-location-dot" style="color: var(--secondary); margin-right: 6px;"></i> ${escapedLocation}</div>` : ''}
                </div>

                <div class="profile-card-footer">
                    <button class="btn btn-secondary btn-sm" onclick="selectPrimaryProfile(${p.id})">
                        <i class="fa-solid fa-arrow-up"></i> Display as Hero
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="openEditProfileModal(${p.id})">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProfile('${encodeURIComponent(p.fullName || '')}', ${p.id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Display selected profile in Hero
 */
window.selectPrimaryProfile = function(id) {
    const profile = allProfiles.find(p => p.id === id);
    if (profile) {
        renderHeroProfile(profile);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(`Viewing profile for ${profile.fullName}`, 'success');
    }
};

/**
 * Handle POST /addProfile
 */
async function handleAddProfile(e) {
    e.preventDefault();
    const btn = document.getElementById('submitAddProfileBtn');
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving to Backend...';

    const idInput = document.getElementById('addProfileId').value.trim();
    const payload = {
        id: idInput ? parseInt(idInput, 10) : null,
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
        if (!response.ok) throw new Error(msg || 'Failed to save profile');

        showToast(msg || 'Profile saved successfully!', 'success');
        document.getElementById('addProfileForm').reset();
        document.getElementById('addProfileModal').classList.remove('active');
        await loadAllProfiles();
    } catch (err) {
        console.error('POST /addProfile error:', err);
        showToast(err.message || 'Error saving profile', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

/**
 * Open Update Profile Modal and populate inputs with profile data
 */
window.openEditProfileModal = function(id) {
    const profile = allProfiles.find(p => p.id === id);
    if (!profile) {
        showToast('Profile not found', 'error');
        return;
    }

    document.getElementById('updateProfileId').value = profile.id;
    document.getElementById('updateFullName').value = profile.fullName || '';
    document.getElementById('updateHeadline').value = profile.headline || '';
    document.getElementById('updateBio').value = profile.bio || '';
    document.getElementById('updateEmail').value = profile.email || '';
    document.getElementById('updatePhone').value = profile.phoneNumber || '';
    document.getElementById('updateLocation').value = profile.location || '';
    document.getElementById('updateResumeUrl').value = profile.resumeUrl || '';
    document.getElementById('updateGithubUrl').value = profile.githubUrl || '';
    document.getElementById('updateLinkedinUrl').value = profile.linkedinUrl || '';

    const modal = document.getElementById('updateProfileModal');
    if (modal) {
        modal.classList.add('active');
        const firstInput = modal.querySelector('input:not([type="hidden"]), textarea');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
};

/**
 * Handle PUT /upadateprofile/{id}
 */
async function handleUpdateProfile(e) {
    e.preventDefault();
    const id = document.getElementById('updateProfileId').value;
    if (!id) {
        showToast('No profile ID specified for update', 'error');
        return;
    }

    const btn = document.getElementById('submitUpdateProfileBtn');
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Updating in Backend...';

    const payload = {
        fullName: document.getElementById('updateFullName').value.trim(),
        headline: document.getElementById('updateHeadline').value.trim(),
        bio: document.getElementById('updateBio').value.trim(),
        email: document.getElementById('updateEmail').value.trim(),
        phoneNumber: document.getElementById('updatePhone').value.trim(),
        location: document.getElementById('updateLocation').value.trim(),
        resumeUrl: document.getElementById('updateResumeUrl').value.trim(),
        githubUrl: document.getElementById('updateGithubUrl').value.trim(),
        linkedinUrl: document.getElementById('updateLinkedinUrl').value.trim()
    };

    try {
        const response = await fetch(`${API_BASE}/upadateprofile/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Failed to update profile (HTTP ${response.status})`);
        }

        const updatedProfile = await response.json();
        showToast(`Profile for ${updatedProfile.fullName || 'user'} updated successfully!`, 'success');
        document.getElementById('updateProfileModal').classList.remove('active');
        await loadAllProfiles();
    } catch (err) {
        console.error('PUT /upadateprofile error:', err);
        showToast(err.message || 'Error updating profile', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

/**
 * Handle GET /findByfullNameAndId?fullName=...&id=...
 */
async function handleSearchProfile(e) {
    e.preventDefault();
    const fullName = document.getElementById('searchFullName').value.trim();
    const id = document.getElementById('searchId').value.trim();
    const resultBox = document.getElementById('searchResultBox');

    if (!fullName || !id) {
        showToast('Please enter both Full Name and ID', 'error');
        return;
    }

    resultBox.innerHTML = '<p style="color: var(--text-dim);"><i class="fa-solid fa-circle-notch fa-spin"></i> Querying backend...</p>';

    try {
        const url = `${API_BASE}/findByfullNameAndId?fullName=${encodeURIComponent(fullName)}&id=${encodeURIComponent(id)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Profile not found matching criteria');
        const profile = await response.json();

        if (profile && profile.fullName) {
            resultBox.innerHTML = `
                <div class="profile-card" style="margin-top: 14px; border-color: var(--secondary);">
                    <div class="profile-card-header">
                        <div>
                            <h3 class="profile-card-name">${escapeHtml(profile.fullName)}</h3>
                            <div class="profile-card-headline">${escapeHtml(profile.headline || '')}</div>
                        </div>
                        <span class="profile-id-chip">ID: ${profile.id}</span>
                    </div>
                    <p class="profile-card-bio">${escapeHtml(profile.bio || 'No bio available.')}</p>
                    <div class="profile-card-info-list">
                        <div><i class="fa-solid fa-envelope" style="color: var(--secondary); margin-right: 6px;"></i> ${escapeHtml(profile.email || 'N/A')}</div>
                        <div><i class="fa-solid fa-location-dot" style="color: var(--secondary); margin-right: 6px;"></i> ${escapeHtml(profile.location || 'N/A')}</div>
                    </div>
                    <button class="btn btn-primary btn-sm" style="width: 100%; justify-content: center;" onclick="selectPrimaryProfile(${profile.id}); document.getElementById('searchProfileModal').classList.remove('active');">
                        <i class="fa-solid fa-check"></i> Display on Portfolio
                    </button>
                </div>
            `;
        } else {
            resultBox.innerHTML = '<p style="color: var(--danger); margin-top: 14px;">No profile found with that Name and ID.</p>';
        }
    } catch (err) {
        console.error('Search error:', err);
        resultBox.innerHTML = `<p style="color: var(--danger); margin-top: 14px;">${escapeHtml(err.message || 'Profile not found.')}</p>`;
    }
}

/**
 * Handle DELETE /DeleteByfullNameAndId/{fullName}/{id}
 */
window.deleteProfile = async function(encodedFullName, id) {
    const fullName = decodeURIComponent(encodedFullName);
    if (!confirm(`Are you sure you want to delete profile "${fullName}" (ID: ${id})?`)) {
        return;
    }

    try {
        const url = `${API_BASE}/DeleteByfullNameAndId/${encodeURIComponent(fullName)}/${encodeURIComponent(id)}`;
        const response = await fetch(url, { method: 'DELETE' });
        const text = await response.text();

        showToast(text || 'Profile deleted successfully', 'success');
        await loadAllProfiles();
    } catch (err) {
        console.error('DELETE profile error:', err);
        showToast('Error deleting profile from backend', 'error');
    }
};

// =========================================================
// PROJECTS API INTEGRATION
// =========================================================

/**
 * Fetch all projects via GET /getallprojects
 */
async function loadAllProjects() {
    const listContainer = document.getElementById('projectsList');
    if (listContainer) {
        listContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-dim);">
                <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
                <p>Retrieving projects from Spring Boot...</p>
            </div>
        `;
    }

    try {
        const response = await fetch(`${API_BASE}/getallprojects`);
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to load projects`);
        allProjects = await response.json();
        renderProjectsList(allProjects);
    } catch (err) {
        console.warn('Projects load error:', err);
        if (listContainer) {
            listContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
                    <p style="color: var(--text-low); margin-bottom: 14px;">No projects loaded. Click "+ New Project" to add your first project.</p>
                    <button class="btn btn-primary btn-sm" onclick="document.getElementById('addProjectModal').classList.add('active')">
                        <i class="fa-solid fa-plus"></i> Add Project
                    </button>
                </div>
            `;
        }
    }
}

/**
 * Render Projects grid cards
 */
function renderProjectsList(projects) {
    const container = document.getElementById('projectsList');
    if (!container) return;

    if (!projects || projects.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
                <i class="fa-solid fa-layer-group fa-2x" style="color: var(--text-dim); margin-bottom: 14px;"></i>
                <p style="color: var(--text-mid); margin-bottom: 14px;">No projects registered in the database yet.</p>
                <button class="btn btn-primary btn-sm" onclick="document.getElementById('addProjectModal').classList.add('active')">
                    <i class="fa-solid fa-plus"></i> Add First Project
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = projects.map(p => {
        const tags = (p.technologies || '')
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

        const imgUrl = p.thumbnailUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&q=80';
        const dateRange = formatDateRange(p.startDate, p.endDate);

        return `
            <div class="project-card">
                <div class="project-thumb-box">
                    <img class="project-thumb" src="${escapeHtml(imgUrl)}" alt="${escapeHtml(p.title || 'Project')}" onerror="this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&q=80'">
                </div>

                <div class="project-card-body">
                    <div class="project-title-row">
                        <h3 class="project-title">${escapeHtml(p.title || 'Untitled Project')}</h3>
                        ${p.featured ? '<span class="featured-chip"><i class="fa-solid fa-star"></i> Featured</span>' : ''}
                    </div>

                    ${p.shortDescription ? `<div class="project-summary">${escapeHtml(p.shortDescription)}</div>` : ''}
                    ${p.description ? `<p class="project-details">${escapeHtml(p.description)}</p>` : ''}

                    ${tags.length > 0 ? `
                        <div class="tech-tag-row">
                            ${tags.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
                        </div>
                    ` : ''}

                    ${dateRange ? `<div class="project-dates"><i class="fa-regular fa-calendar"></i> ${dateRange}</div>` : ''}

                    <div class="project-action-bar">
                        <div class="project-links-group">
                            ${p.liveUrl ? `<a href="${escapeHtml(p.liveUrl)}" target="_blank" class="btn btn-secondary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ''}
                            ${p.githubUrl ? `<a href="${escapeHtml(p.githubUrl)}" target="_blank" class="btn btn-secondary btn-sm"><i class="fa-brands fa-github"></i> Code</a>` : ''}
                            <button class="btn btn-secondary btn-sm" onclick="openEditProjectModal('${encodeURIComponent(p.title || '')}')" title="Edit Project">
                                <i class="fa-solid fa-pen-to-square"></i> Edit
                            </button>
                        </div>
                        <button class="btn btn-danger btn-sm" onclick="deleteProject(${p.id})" title="Delete Project">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Handle POST /addProjects
 */
async function handleAddProject(e) {
    e.preventDefault();
    const btn = document.getElementById('submitAddProjectBtn');
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving to Backend...';

    const payload = {
        title: document.getElementById('projectTitle').value.trim(),
        shortDescription: document.getElementById('projectShortDesc').value.trim(),
        description: document.getElementById('projectDesc').value.trim(),
        technologies: document.getElementById('projectTech').value.trim(),
        thumbnailUrl: document.getElementById('projectThumbUrl').value.trim() || null,
        liveUrl: document.getElementById('projectLiveUrl').value.trim() || null,
        githubUrl: document.getElementById('projectGithubUrl').value.trim() || null,
        startDate: document.getElementById('projectStartDate').value || null,
        endDate: document.getElementById('projectEndDate').value || null,
        featured: document.getElementById('projectFeatured').checked
    };

    try {
        const response = await fetch(`${API_BASE}/addProjects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Failed to save project');
        }

        const created = await response.json();
        showToast(`Project "${created.title || 'New Project'}" created successfully!`, 'success');
        document.getElementById('addProjectForm').reset();
        document.getElementById('addProjectModal').classList.remove('active');
        await loadAllProjects();
    } catch (err) {
        console.error('POST /addProjects error:', err);
        showToast(err.message || 'Error saving project', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

/**
 * Handle DELETE /DeleteById/{id}
 */
window.deleteProject = async function(id) {
    if (!confirm(`Are you sure you want to delete this project (ID: ${id})?`)) {
        return;
    }

    try {
        const url = `${API_BASE}/DeleteById/${encodeURIComponent(id)}`;
        const response = await fetch(url, { method: 'DELETE' });
        const text = await response.text();

        showToast(text || 'Project deleted successfully', 'success');
        await loadAllProjects();
    } catch (err) {
        console.error('DELETE project error:', err);
        showToast('Error deleting project from backend', 'error');
    }
};

/**
 * Open Update Project Modal and populate inputs with project data
 */
window.openEditProjectModal = function(encodedTitle) {
    const title = decodeURIComponent(encodedTitle);
    const project = allProjects.find(p => (p.title || '').trim() === title.trim());
    if (!project) {
        showToast(`Project "${title}" not found in loaded list`, 'error');
        return;
    }

    document.getElementById('updateOriginalTitle').value = project.title || '';
    document.getElementById('updateProjectTitle').value = project.title || '';
    document.getElementById('updateProjectShortDesc').value = project.shortDescription || '';
    document.getElementById('updateProjectDesc').value = project.description || '';
    document.getElementById('updateProjectTech').value = project.technologies || '';
    document.getElementById('updateProjectThumbUrl').value = project.thumbnailUrl || '';
    document.getElementById('updateProjectLiveUrl').value = project.liveUrl || '';
    document.getElementById('updateProjectGithubUrl').value = project.githubUrl || '';
    document.getElementById('updateProjectStartDate').value = project.startDate || '';
    document.getElementById('updateProjectEndDate').value = project.endDate || '';
    document.getElementById('updateProjectFeatured').checked = !!project.featured;

    const modal = document.getElementById('updateProjectModal');
    if (modal) {
        modal.classList.add('active');
        const firstInput = modal.querySelector('input:not([type="hidden"]), textarea');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
};

/**
 * Handle PUT /UpadateProjects/{title}
 */
async function handleUpdateProject(e) {
    e.preventDefault();
    const originalTitle = document.getElementById('updateOriginalTitle').value.trim();
    if (!originalTitle) {
        showToast('Original project title missing', 'error');
        return;
    }

    const btn = document.getElementById('submitUpdateProjectBtn');
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Updating in Backend...';

    const payload = {
        title: document.getElementById('updateProjectTitle').value.trim(),
        shortDescription: document.getElementById('updateProjectShortDesc').value.trim(),
        description: document.getElementById('updateProjectDesc').value.trim(),
        technologies: document.getElementById('updateProjectTech').value.trim(),
        thumbnailUrl: document.getElementById('updateProjectThumbUrl').value.trim() || null,
        liveUrl: document.getElementById('updateProjectLiveUrl').value.trim() || null,
        githubUrl: document.getElementById('updateProjectGithubUrl').value.trim() || null,
        startDate: document.getElementById('updateProjectStartDate').value || null,
        endDate: document.getElementById('updateProjectEndDate').value || null,
        featured: document.getElementById('updateProjectFeatured').checked
    };

    try {
        const response = await fetch(`${API_BASE}/UpadateProjects/${encodeURIComponent(originalTitle)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || `Failed to update project (HTTP ${response.status})`);
        }

        const updated = await response.json();
        showToast(`Project "${updated.title || payload.title}" updated successfully!`, 'success');
        document.getElementById('updateProjectForm').reset();
        document.getElementById('updateProjectModal').classList.remove('active');
        await loadAllProjects();
    } catch (err) {
        console.error('PUT /UpadateProjects error:', err);
        showToast(err.message || 'Error updating project', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

/**
 * Handle GET /getprojectBytitle?title=...
 */
async function handleSearchProject(e) {
    e.preventDefault();
    const title = document.getElementById('searchProjectTitle').value.trim();
    const resultBox = document.getElementById('searchProjectResultBox');

    if (!title) {
        showToast('Please enter a project title', 'error');
        return;
    }

    resultBox.innerHTML = '<p style="color: var(--text-dim);"><i class="fa-solid fa-circle-notch fa-spin"></i> Searching project in backend...</p>';

    try {
        const response = await fetch(`${API_BASE}/getprojectBytitle?title=${encodeURIComponent(title)}`);
        if (!response.ok) throw new Error('Project not found with that title');
        const proj = await response.json();

        if (proj && proj.title) {
            const tags = (proj.technologies || '').split(',').map(t => t.trim()).filter(Boolean);
            resultBox.innerHTML = `
                <div class="project-card" style="margin-top: 14px; border-color: var(--primary);">
                    <div class="project-card-body">
                        <div class="project-title-row">
                            <h3 class="project-title">${escapeHtml(proj.title)}</h3>
                            ${proj.featured ? '<span class="featured-chip"><i class="fa-solid fa-star"></i> Featured</span>' : ''}
                        </div>
                        ${proj.shortDescription ? `<div class="project-summary">${escapeHtml(proj.shortDescription)}</div>` : ''}
                        ${proj.description ? `<p class="project-details">${escapeHtml(proj.description)}</p>` : ''}
                        ${tags.length > 0 ? `
                            <div class="tech-tag-row" style="margin: 10px 0;">
                                ${tags.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')}
                            </div>
                        ` : ''}
                        <div style="display: flex; gap: 10px; margin-top: 14px;">
                            <button class="btn btn-secondary btn-sm" onclick="openEditProjectModal('${encodeURIComponent(proj.title)}'); document.getElementById('searchProjectModal').classList.remove('active');">
                                <i class="fa-solid fa-pen-to-square"></i> Edit this Project
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteProject(${proj.id}); document.getElementById('searchProjectModal').classList.remove('active');">
                                <i class="fa-solid fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultBox.innerHTML = '<p style="color: var(--danger); margin-top: 14px;">No project found with that exact title.</p>';
        }
    } catch (err) {
        console.error('Search project error:', err);
        resultBox.innerHTML = `<p style="color: var(--danger); margin-top: 14px;">${escapeHtml(err.message || 'Project not found.')}</p>`;
    }
}

// =========================================================
// SKILLS API INTEGRATION (POST /addSkills)
// =========================================================

/**
 * Load and render custom added skills from local persistence
 */
function loadSavedSkills() {
    try {
        const saved = JSON.parse(localStorage.getItem('savedSkills') || '[]');
        saved.forEach(skill => appendSkillToUI(skill));
    } catch (e) {
        console.warn('Could not load saved skills from storage', e);
    }
}

/**
 * Handle POST /addSkills
 */
async function handleAddSkill(e) {
    e.preventDefault();
    const btn = document.getElementById('submitAddSkillBtn');
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving Skill...';

    const payload = {
        name: document.getElementById('skillName').value.trim(),
        category: document.getElementById('skillCategory').value.trim(),
        proficiency: document.getElementById('skillProficiency').value.trim(),
        iconUrl: document.getElementById('skillIconUrl').value.trim() || null,
        displayOrder: parseInt(document.getElementById('skillDisplayOrder').value, 10) || 1
    };

    try {
        const response = await fetch(`${API_BASE}/addSkills`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Failed to save skill to backend');
        }

        const created = await response.json();
        appendSkillToUI(created);

        // Persist in local storage
        try {
            const saved = JSON.parse(localStorage.getItem('savedSkills') || '[]');
            saved.push(created);
            localStorage.setItem('savedSkills', JSON.stringify(saved));
        } catch (storageErr) {
            console.warn('Storage error', storageErr);
        }

        showToast(`Skill "${created.name || payload.name}" saved to database!`, 'success');
        document.getElementById('addSkillForm').reset();
        document.getElementById('addSkillModal').classList.remove('active');
    } catch (err) {
        console.error('POST /addSkills error:', err);
        showToast(err.message || 'Error saving skill', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

/**
 * Append skill chip dynamically to corresponding category card
 */
function appendSkillToUI(skill) {
    if (!skill || !skill.name) return;

    const cat = (skill.category || '').toLowerCase();
    let targetContainer = null;

    if (cat.includes('lang')) {
        targetContainer = document.getElementById('skills-languages');
    } else if (cat.includes('back') || cat.includes('frame')) {
        targetContainer = document.getElementById('skills-backend');
    } else if (cat.includes('data') && (cat.includes('base') || cat.includes('persist'))) {
        targetContainer = document.getElementById('skills-databases');
    } else if (cat.includes('tool') || cat.includes('dev')) {
        targetContainer = document.getElementById('skills-tools');
    } else if (cat.includes('ai') || cat.includes('machine') || cat.includes('data science')) {
        targetContainer = document.getElementById('skills-ai');
    } else if (cat.includes('core') || cat.includes('comp')) {
        targetContainer = document.getElementById('skills-core');
    }

    // If no matching predefined category, create or append to custom category card
    if (!targetContainer) {
        targetContainer = document.getElementById('skills-custom');
        if (!targetContainer) {
            const container = document.getElementById('skillsContainer');
            if (container) {
                const customCard = document.createElement('div');
                customCard.className = 'skill-category-card';
                customCard.innerHTML = `
                    <div class="skill-cat-header">
                        <div class="skill-cat-icon"><i class="fa-solid fa-shapes"></i></div>
                        <h3 class="skill-cat-title">${escapeHtml(skill.category || 'Specialized Skills')}</h3>
                    </div>
                    <div class="skill-chips" id="skills-custom"></div>
                `;
                container.appendChild(customCard);
                targetContainer = document.getElementById('skills-custom');
            }
        }
    }

    if (targetContainer) {
        // Prevent duplicate rendering
        const existing = Array.from(targetContainer.querySelectorAll('.skill-chip')).find(
            chip => chip.textContent.toLowerCase().includes(skill.name.toLowerCase())
        );
        if (existing) return;

        const iconHtml = skill.iconUrl && skill.iconUrl.startsWith('fa')
            ? `<i class="${escapeHtml(skill.iconUrl)}" style="color: var(--secondary);"></i> `
            : `<i class="fa-solid fa-code" style="color: var(--secondary);"></i> `;

        const proficiencyHtml = skill.proficiency
            ? `<span class="proficiency-tag">${escapeHtml(skill.proficiency)}</span>`
            : '';

        const chip = document.createElement('span');
        chip.className = 'skill-chip skill-chip-new';
        chip.innerHTML = `${iconHtml}${escapeHtml(skill.name)}${proficiencyHtml}`;
        targetContainer.appendChild(chip);
    }
}

// =========================================================
// CONTACT & UTILITY FUNCTIONS
// =========================================================

/**
 * Contact Dispatcher (Direct mailto trigger & prefilled client)
 */
function handleQuickEmailSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contactSenderName').value.trim();
    const email = document.getElementById('contactSenderEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    const targetEmail = document.getElementById('heroEmail').textContent.trim() || DEFAULT_VISHU_PROFILE.email;
    const bodyContent = `Hi Vishu,\n\n${message}\n\nBest regards,\n${name}\n(${email})`;

    const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;

    window.location.href = mailtoUrl;
    showToast('Opening default email client with your message...', 'success');
}

/**
 * Copy message to clipboard helper
 */
function handleCopyMessage() {
    const name = document.getElementById('contactSenderName').value.trim();
    const email = document.getElementById('contactSenderEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!message) {
        showToast('Please type a message first to copy.', 'error');
        return;
    }

    const fullMsg = `From: ${name} (${email})\n\n${message}`;
    navigator.clipboard.writeText(fullMsg).then(() => {
        showToast('Message copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Could not copy to clipboard', 'error');
    });
}

function formatDateRange(startDate, endDate) {
    if (!startDate && !endDate) return '';
    const s = startDate ? new Date(startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';
    const e = endDate ? new Date(endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present';
    return s ? `${s} &mdash; ${e}` : e;
}

function setElemText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastWrap');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerHTML = `<i class="${type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4500);
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
