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
    setupModal('openAddProjectModalBtn', 'addProjectModal', 'closeAddProjectModal');
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
