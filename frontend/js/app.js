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
let allSkills = [];

function setElemText(id, text) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = text !== null && text !== undefined ? text : '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupNavigation();
    setupEventListeners();
    setupTemplates();
    loadAllProfiles();
    loadAllProjects();
    loadAllSkills();
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
    const searchModalBtn = document.getElementById('openSearchProfileModalBtn');
    if (searchModalBtn) {
        searchModalBtn.addEventListener('click', updateSearchModalHints);
    }
    setupModal(null, 'updateProfileModal', 'closeUpdateProfileModal');
    setupModal('openAddProjectModalBtn', 'addProjectModal', 'closeAddProjectModal');
    setupModal('openSearchProjectModalBtn', 'searchProjectModal', 'closeSearchProjectModal');
    setupModal(null, 'updateProjectModal', 'closeUpdateProjectModal');
    setupModal('openAddSkillModalBtn', 'addSkillModal', 'closeAddSkillModal');
    setupModal('openAddSkillSectionBtn', 'addSkillModal', 'closeAddSkillModal');
    setupModal('openTemplateModalBtn', 'templateGalleryModal', 'closeTemplateModal');

    // AI Tour Guide Chatbot Event Wiring
    setupAiChatbot();
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
            renderEmptyProfileState();
        }

        renderProfilesList(allProfiles);
        updateSearchModalHints();
    } catch (err) {
        console.warn('Profiles load error:', err);
        renderEmptyProfileState();
        if (listContainer) {
            listContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 36px; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
                    <p style="color: var(--text-low); margin-bottom: 12px;">No registered profiles in the database yet.</p>
                    <button class="btn btn-primary btn-sm" onclick="document.getElementById('addProfileModal').classList.add('active')">
                        <i class="fa-solid fa-plus"></i> Add Profile
                    </button>
                </div>
            `;
        }
    }
}

/**
 * Renders an empty placeholder state when no profile has been registered yet
 */
function renderEmptyProfileState() {
    setElemText('navBrandName', 'Portfolio Generator');
    setElemText('heroGreeting', 'Welcome to');
    setElemText('heroFullName', 'Portfolio Generator');
    setElemText('heroHeadlineText', 'Full-Stack Portfolio Platform');
    setElemText('heroBio', 'No profile has been registered in the database yet. Click "+ Add Profile" in the navigation bar to register your name, headline, bio, contact details, and social links.');

    const heroStatusText = document.getElementById('heroStatusText');
    if (heroStatusText) heroStatusText.textContent = 'Setup Mode';

    // Hide contact chips
    ['heroEmailChip', 'heroPhoneChip', 'heroLocationChip', 'heroResumeBtn', 'heroGithubBtn', 'heroLinkedinBtn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Terminal preview
    const terminalFields = document.getElementById('terminalFields');
    if (terminalFields) {
        terminalFields.innerHTML = `
            <div><span class="code-fn">status</span>: <span class="code-str">"Waiting for registration..."</span>,</div>
            <div><span class="code-fn">action</span>: <span class="code-str">"Click 'Add Profile' to register"</span>,</div>
            <div><span class="code-fn">backendReady</span>: <span class="code-keyword">true</span></div>
        `;
    }

    // About section
    const aboutBioContent = document.getElementById('aboutBioContent');
    if (aboutBioContent) {
        aboutBioContent.innerHTML = `
            <p style="color: var(--text-mid);">
                No background bio available yet. As soon as you register a profile, your bio and experience will be retrieved from the database and displayed here.
            </p>
            <button class="btn btn-primary btn-sm" style="margin-top: 14px;" onclick="document.getElementById('addProfileModal').classList.add('active')">
                <i class="fa-solid fa-user-plus"></i> Add Profile
            </button>
        `;
    }

    const noContactMsg = document.getElementById('noContactInfoMsg');
    if (noContactMsg) noContactMsg.style.display = 'block';
    ['directEmailLink', 'directLinkedinLink', 'directGithubLink', 'contactLocationItem'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

/**
 * Populates the Hero & Contact section strictly with the registered user profile from backend
 */
function renderHeroProfile(profile) {
    if (!profile) {
        renderEmptyProfileState();
        return;
    }

    const name = (profile.fullName || '').trim() || 'Developer';
    setElemText('navBrandName', name);
    setElemText('heroGreeting', "Hi, I'm");
    setElemText('heroFullName', name);
    setElemText('heroHeadlineText', profile.headline || 'Software Engineer');
    setElemText('heroBio', profile.bio || 'Software Engineer crafting solutions with modern technologies.');

    const heroStatusText = document.getElementById('heroStatusText');
    if (heroStatusText) heroStatusText.textContent = 'Active Portfolio';

    // Email
    const emailChip = document.getElementById('heroEmailChip');
    const heroEmail = document.getElementById('heroEmail');
    if (profile.email && profile.email.trim()) {
        if (heroEmail) heroEmail.textContent = profile.email;
        if (emailChip) emailChip.style.display = 'inline-flex';
    } else if (emailChip) {
        emailChip.style.display = 'none';
    }

    // Phone
    const phoneChip = document.getElementById('heroPhoneChip');
    const heroPhone = document.getElementById('heroPhone');
    if (profile.phoneNumber && profile.phoneNumber.trim()) {
        if (heroPhone) heroPhone.textContent = profile.phoneNumber;
        if (phoneChip) phoneChip.style.display = 'inline-flex';
    } else if (phoneChip) {
        phoneChip.style.display = 'none';
    }

    // Location
    const locationChip = document.getElementById('heroLocationChip');
    const heroLocation = document.getElementById('heroLocation');
    if (profile.location && profile.location.trim()) {
        if (heroLocation) heroLocation.textContent = profile.location;
        if (locationChip) locationChip.style.display = 'inline-flex';
    } else if (locationChip) {
        locationChip.style.display = 'none';
    }

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
        if (profile.githubUrl && profile.githubUrl.trim()) {
            githubBtn.href = profile.githubUrl;
            githubBtn.style.display = 'inline-flex';
        } else {
            githubBtn.style.display = 'none';
        }
    }

    // LinkedIn button
    const linkedinBtn = document.getElementById('heroLinkedinBtn');
    if (linkedinBtn) {
        if (profile.linkedinUrl && profile.linkedinUrl.trim()) {
            linkedinBtn.href = profile.linkedinUrl;
            linkedinBtn.style.display = 'inline-flex';
        } else {
            linkedinBtn.style.display = 'none';
        }
    }

    // Terminal preview card
    const parts = name.split(/\s+/);
    const initials = parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();

    const terminalFields = document.getElementById('terminalFields');
    if (terminalFields) {
        terminalFields.innerHTML = `
            <div><span class="code-fn">name</span>: <span class="code-str">"${escapeHtml(name)}"</span>,</div>
            <div><span class="code-fn">role</span>: <span class="code-str">"${escapeHtml(profile.headline || '')}"</span>,</div>
            <div><span class="code-fn">email</span>: <span class="code-str">"${escapeHtml(profile.email || '')}"</span>,</div>
            <div><span class="code-fn">location</span>: <span class="code-str">"${escapeHtml(profile.location || '')}"</span>,</div>
            <div><span class="code-fn">initials</span>: <span class="code-str">"${escapeHtml(initials)}"</span>,</div>
            <div><span class="code-fn">verified</span>: <span class="code-keyword">true</span></div>
        `;
    }

    // About section
    const aboutBioContent = document.getElementById('aboutBioContent');
    if (aboutBioContent) {
        aboutBioContent.innerHTML = `
            <p>${escapeHtml(profile.bio || 'No detailed bio provided yet.')}</p>
        `;
    }
    const aboutHeadlineHighlight = document.getElementById('aboutHeadlineHighlight');
    if (aboutHeadlineHighlight && profile.headline) {
        aboutHeadlineHighlight.textContent = profile.headline;
    }
    const aboutRoleHighlight = document.getElementById('aboutRoleHighlight');
    if (aboutRoleHighlight && profile.headline) {
        aboutRoleHighlight.textContent = profile.headline.split('|')[0].trim();
    }

    // Sync Contact Section
    const noContactMsg = document.getElementById('noContactInfoMsg');
    let hasAnyContact = false;

    const contactEmailVal = document.getElementById('contactEmailVal');
    const directEmailLink = document.getElementById('directEmailLink');
    if (profile.email && profile.email.trim()) {
        if (contactEmailVal) contactEmailVal.textContent = profile.email;
        if (directEmailLink) {
            directEmailLink.href = `mailto:${profile.email}`;
            directEmailLink.style.display = 'flex';
        }
        hasAnyContact = true;
    } else if (directEmailLink) {
        directEmailLink.style.display = 'none';
    }

    const directLinkedinLink = document.getElementById('directLinkedinLink');
    if (profile.linkedinUrl && profile.linkedinUrl.trim()) {
        if (directLinkedinLink) {
            directLinkedinLink.href = profile.linkedinUrl;
            directLinkedinLink.style.display = 'flex';
        }
        hasAnyContact = true;
    } else if (directLinkedinLink) {
        directLinkedinLink.style.display = 'none';
    }

    const directGithubLink = document.getElementById('directGithubLink');
    if (profile.githubUrl && profile.githubUrl.trim()) {
        if (directGithubLink) {
            directGithubLink.href = profile.githubUrl;
            directGithubLink.style.display = 'flex';
        }
        hasAnyContact = true;
    } else if (directGithubLink) {
        directGithubLink.style.display = 'none';
    }

    const contactLocationItem = document.getElementById('contactLocationItem');
    const contactLocationVal = document.getElementById('contactLocationVal');
    if (profile.location && profile.location.trim()) {
        if (contactLocationVal) contactLocationVal.textContent = profile.location;
        if (contactLocationItem) contactLocationItem.style.display = 'flex';
        hasAnyContact = true;
    } else if (contactLocationItem) {
        contactLocationItem.style.display = 'none';
    }

    if (noContactMsg) {
        noContactMsg.style.display = hasAnyContact ? 'none' : 'block';
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

    resultBox.innerHTML = '<p style="color: var(--text-dim);"><i class="fa-solid fa-circle-notch fa-spin"></i> Querying backend (GET /findByfullNameAndId)...</p>';

    try {
        const url = `${API_BASE}/findByfullNameAndId?fullName=${encodeURIComponent(fullName)}&id=${encodeURIComponent(id)}`;
        const response = await fetch(url);
        
        let profile = null;
        if (response.ok) {
            const text = await response.text();
            if (text && text.trim().length > 0) {
                try {
                    profile = JSON.parse(text);
                } catch (parseErr) {
                    console.error('JSON parse error:', parseErr);
                }
            }
        }

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
                    <button class="btn btn-primary btn-sm" style="width: 100%; justify-content: center; margin-top: 10px;" onclick="selectPrimaryProfile(${profile.id}); document.getElementById('searchProfileModal').classList.remove('active');">
                        <i class="fa-solid fa-check"></i> Display on Portfolio
                    </button>
                </div>
            `;
            showToast(`Profile found for ${profile.fullName}!`, 'success');
        } else {
            // Friendly error with quick fill suggestion
            let helperHtml = '';
            if (allProfiles && allProfiles.length > 0) {
                const chips = allProfiles.map(p => `
                    <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 4px 8px; margin: 3px;" onclick="autofillSearchProfile('${escapeHtml(p.fullName)}', ${p.id})">
                        <i class="fa-solid fa-user-check"></i> ${escapeHtml(p.fullName)} (ID: ${p.id})
                    </button>
                `).join('');
                helperHtml = `
                    <div style="margin-top: 12px; padding: 10px; background: rgba(255, 255, 255, 0.04); border-radius: var(--radius-sm);">
                        <p style="font-size: 0.8rem; color: var(--text-mid); margin-bottom: 6px;">
                            <i class="fa-solid fa-lightbulb" style="color: var(--warning);"></i> Try searching one of these existing profiles in the database:
                        </p>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">${chips}</div>
                    </div>
                `;
            } else {
                helperHtml = `
                    <p style="font-size: 0.8rem; color: var(--text-dim); margin-top: 8px;">
                        No profiles are currently registered in the database. Use "+ Add Profile" in the navbar to create one first.
                    </p>
                `;
            }

            resultBox.innerHTML = `
                <div style="margin-top: 14px; padding: 14px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-md);">
                    <p style="color: var(--danger); font-size: 0.88rem; margin: 0; font-weight: 500;">
                        <i class="fa-solid fa-circle-exclamation"></i> No profile found in database with Name "<strong>${escapeHtml(fullName)}</strong>" and ID <strong>${escapeHtml(id)}</strong>.
                    </p>
                    ${helperHtml}
                </div>
            `;
        }
    } catch (err) {
        console.error('Search error:', err);
        resultBox.innerHTML = `<p style="color: var(--danger); margin-top: 14px;">Query failed: ${escapeHtml(err.message || 'Server error')}</p>`;
    }
}

window.selectPrimaryProfile = function(profileId) {
    const profile = (allProfiles || []).find(p => p.id == profileId);
    if (profile) {
        renderHeroProfile(profile);
        showToast(`Displaying ${profile.fullName}'s profile!`, 'success');
    }
};

window.autofillSearchProfile = function(name, id) {
    const nameInput = document.getElementById('searchFullName');
    const idInput = document.getElementById('searchId');
    if (nameInput) nameInput.value = name;
    if (idInput) idInput.value = id;
    const form = document.getElementById('searchProfileForm');
    if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
};

function updateSearchModalHints() {
    const hintBox = document.getElementById('searchAvailableProfilesHint');
    if (!hintBox) return;
    if (allProfiles && allProfiles.length > 0) {
        const chips = allProfiles.map(p => `
            <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 3px 8px; margin: 2px;" onclick="autofillSearchProfile('${escapeHtml(p.fullName)}', ${p.id})">
                <i class="fa-solid fa-user"></i> ${escapeHtml(p.fullName)} (ID: ${p.id})
            </button>
        `).join('');
        hintBox.innerHTML = `
            <div style="padding: 10px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                <span style="color: var(--text-dim); display: block; font-size: 0.78rem; margin-bottom: 6px;">
                    <i class="fa-solid fa-database" style="color: var(--secondary);"></i> Registered Profiles in Database (Click to auto-fill):
                </span>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">${chips}</div>
            </div>
        `;
    } else {
        hintBox.innerHTML = `
            <p style="color: var(--text-dim); font-size: 0.8rem; margin-top: 4px;">
                <i class="fa-solid fa-info-circle"></i> Database currently has 0 registered profiles. Add one first using "+ Add Profile".
            </p>
        `;
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
// =========================================================
// SKILLS API INTEGRATION (GET /GetSkills, POST /addSkills, DELETE /DeleteSkill/{id})
// =========================================================

/**
 * Load and render all skills dynamically from GET /GetSkills backend API
 */
async function loadAllSkills() {
    const container = document.getElementById('skillsContainer');
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-dim);">
                <i class="fa-solid fa-circle-notch fa-spin fa-2x" style="color: var(--primary); margin-bottom: 12px;"></i>
                <p>Retrieving skills from Spring Boot...</p>
            </div>
        `;
    }

    try {
        const response = await fetch(`${API_BASE}/GetSkills`);
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to load skills`);
        allSkills = await response.json();
        renderSkillsContainer(allSkills);
    } catch (err) {
        console.warn('Skills load error:', err);
        if (container) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
                    <p style="color: var(--text-low); margin-bottom: 14px;">No skills loaded from database.</p>
                    <button class="btn btn-primary btn-sm" onclick="document.getElementById('addSkillModal').classList.add('active')">
                        <i class="fa-solid fa-plus"></i> Add First Skill
                    </button>
                </div>
            `;
        }
    }
}

/**
 * Render dynamic skill cards grouped by category directly from backend response
 */
function renderSkillsContainer(skills) {
    const container = document.getElementById('skillsContainer');
    if (!container) return;

    if (!skills || skills.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-lg);">
                <i class="fa-solid fa-code fa-2x" style="color: var(--text-dim); margin-bottom: 14px;"></i>
                <p style="color: var(--text-mid); margin-bottom: 14px;">No skills registered in the database yet.</p>
                <button class="btn btn-primary btn-sm" onclick="document.getElementById('addSkillModal').classList.add('active')">
                    <i class="fa-solid fa-plus"></i> Add Your First Skill
                </button>
            </div>
        `;
        return;
    }

    // Group skills by category
    const categoriesMap = {};
    skills.forEach(skill => {
        const cat = (skill.category || 'General').trim();
        if (!categoriesMap[cat]) {
            categoriesMap[cat] = [];
        }
        categoriesMap[cat].push(skill);
    });

    const categoryKeys = Object.keys(categoriesMap);

    container.innerHTML = categoryKeys.map(cat => {
        const catSkills = categoriesMap[cat];
        return `
            <div class="skill-category-card" data-category="${escapeHtml(cat)}">
                <div class="skill-cat-header">
                    <div class="skill-cat-icon"><i class="fa-solid fa-layer-group"></i></div>
                    <h3 class="skill-cat-title">${escapeHtml(cat)}</h3>
                </div>
                <div class="skill-chips">
                    ${catSkills.map(s => {
                        const iconClass = s.iconUrl && s.iconUrl.trim().startsWith('fa')
                            ? escapeHtml(s.iconUrl.trim())
                            : 'fa-solid fa-code';
                        const profHtml = s.proficiency
                            ? `<span class="proficiency-tag">${escapeHtml(s.proficiency)}</span>`
                            : '';
                        const deleteBtn = s.id
                            ? `<button type="button" class="skill-delete-btn" onclick="deleteSkill(${s.id})" title="Delete Skill">&times;</button>`
                            : '';
                        return `
                            <span class="skill-chip">
                                <i class="${iconClass}" style="color: var(--secondary);"></i>
                                <span>${escapeHtml(s.name)}</span>
                                ${profHtml}
                                ${deleteBtn}
                            </span>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
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
        showToast(`Skill "${created.name || payload.name}" saved to database!`, 'success');
        document.getElementById('addSkillForm').reset();
        document.getElementById('addSkillModal').classList.remove('active');
        await loadAllSkills();
    } catch (err) {
        console.error('POST /addSkills error:', err);
        showToast(err.message || 'Error saving skill', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

/**
 * Handle DELETE /DeleteSkill/{id}
 */
window.deleteSkill = async function(id) {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
        const response = await fetch(`${API_BASE}/DeleteSkill/${encodeURIComponent(id)}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Failed to delete skill');
        }
        showToast('Skill deleted from database', 'success');
        await loadAllSkills();
    } catch (err) {
        console.error('Delete skill error:', err);
        showToast('Error deleting skill from backend', 'error');
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

// =========================================================
// AI TOUR GUIDE CHATBOT INTEGRATION (POST /ClientTalk & /clear)
// =========================================================

function setupAiChatbot() {
    const floatingBtn = document.getElementById('aiChatFloatingBtn');
    const drawer = document.getElementById('aiChatDrawer');
    const closeBtn = document.getElementById('aiCloseChatBtn');
    const navbarAiBtn = document.getElementById('openAiChatBtn');
    const heroAiBtn = document.getElementById('heroAiTourBtn');
    const clearBtn = document.getElementById('aiClearHistoryBtn');
    const form = document.getElementById('aiChatForm');

    const toggleDrawer = () => {
        if (!drawer) return;
        drawer.classList.toggle('active');
        if (drawer.classList.contains('active')) {
            const input = document.getElementById('aiChatInput');
            if (input) setTimeout(() => input.focus(), 150);
        }
    };

    if (floatingBtn) floatingBtn.addEventListener('click', toggleDrawer);
    if (navbarAiBtn) navbarAiBtn.addEventListener('click', () => {
        if (drawer && !drawer.classList.contains('active')) toggleDrawer();
    });
    if (heroAiBtn) heroAiBtn.addEventListener('click', () => {
        if (drawer && !drawer.classList.contains('active')) toggleDrawer();
    });
    if (closeBtn) closeBtn.addEventListener('click', () => {
        if (drawer) drawer.classList.remove('active');
    });

    if (clearBtn) clearBtn.addEventListener('click', handleClearAiHistory);
    if (form) form.addEventListener('submit', handleAiChatSubmit);
}

window.sendAiQuickMessage = function(promptText) {
    const input = document.getElementById('aiChatInput');
    if (input) {
        input.value = promptText;
        const form = document.getElementById('aiChatForm');
        if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
};

async function handleAiChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiChatSendBtn');
    const messagesBox = document.getElementById('aiChatMessages');
    if (!input || !messagesBox) return;

    const userText = input.value.trim();
    if (!userText) return;

    // Append user message bubble
    appendChatMessage('user', userText);
    input.value = '';

    // Append loading typing indicator
    const typingElem = document.createElement('div');
    typingElem.className = 'ai-msg ai-msg-bot';
    typingElem.id = 'aiTypingIndicator';
    typingElem.innerHTML = `
        <div class="ai-msg-bubble">
            <div class="ai-typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    messagesBox.appendChild(typingElem);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    if (sendBtn) sendBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/ClientTalk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || `HTTP error ${response.status}`);
        }

        const reply = await response.text();
        const indicator = document.getElementById('aiTypingIndicator');
        if (indicator) indicator.remove();

        appendChatMessage('bot', reply);
    } catch (err) {
        console.error('AI Chat error:', err);
        const indicator = document.getElementById('aiTypingIndicator');
        if (indicator) indicator.remove();
        appendChatMessage('bot', `⚠️ Sorry, could not connect to Gemini AI: ${escapeHtml(err.message || 'Server error')}. Please check backend logs.`);
    } finally {
        if (sendBtn) sendBtn.disabled = false;
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }
}

function appendChatMessage(sender, text) {
    const messagesBox = document.getElementById('aiChatMessages');
    if (!messagesBox) return;

    const msgElem = document.createElement('div');
    msgElem.className = `ai-msg ai-msg-${sender}`;

    // Format simple markdown / linebreaks
    const formatted = formatAiText(text);

    msgElem.innerHTML = `<div class="ai-msg-bubble">${formatted}</div>`;
    messagesBox.appendChild(msgElem);
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

function formatAiText(text) {
    if (!text) return '';
    let escaped = escapeHtml(text);
    // Bold **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet points * item or - item
    escaped = escaped.replace(/^[\*\-]\s+(.*)$/gm, '&bull; $1<br>');
    // Line breaks
    escaped = escaped.replace(/\n/g, '<br>');
    return escaped;
}

async function handleClearAiHistory() {
    try {
        const response = await fetch(`${API_BASE}/clear`, { method: 'POST' });
        const resText = await response.text();
        showToast(resText || 'Conversation memory reset', 'success');

        const messagesBox = document.getElementById('aiChatMessages');
        if (messagesBox) {
            messagesBox.innerHTML = `
                <div class="ai-msg ai-msg-bot">
                    <div class="ai-msg-bubble">
                        Memory cleared! ✨ How can I guide you through Vishu's portfolio?
                    </div>
                    <div class="ai-quick-prompts">
                        <button class="ai-quick-btn" onclick="sendAiQuickMessage('Give me a quick tour of Vishu\\'s portfolio')">🚀 Quick Tour</button>
                        <button class="ai-quick-btn" onclick="sendAiQuickMessage('What are Vishu\\'s core backend skills?')">☕ Core Skills</button>
                        <button class="ai-quick-btn" onclick="sendAiQuickMessage('Tell me about the featured projects')">💼 Top Projects</button>
                    </div>
                </div>
            `;
        }
    } catch (err) {
        console.error('Clear history error:', err);
        showToast('Could not clear history', 'error');
    }
}

// =========================================================
// 40 DEVELOPER PORTFOLIO TEMPLATES / THEMES SYSTEM
// =========================================================

const PORTFOLIO_TEMPLATES = [
    {
        "id": "obsidian-pro",
        "name": "Obsidian Pro",
        "category": "dark",
        "categoryLabel": "Modern Dark",
        "desc": "Modern dark palette featuring #6366f1 highlights.",
        "swatches": [
            "#080b11",
            "#0e1420",
            "#6366f1",
            "#06b6d4"
        ]
    },
    {
        "id": "tokyo-night",
        "name": "Tokyo Night",
        "category": "dark",
        "categoryLabel": "Modern Dark",
        "desc": "Modern dark palette featuring #7aa2f7 highlights.",
        "swatches": [
            "#1a1b26",
            "#24283b",
            "#7aa2f7",
            "#bb9af7"
        ]
    },
    {
        "id": "dracula-midnight",
        "name": "Dracula Midnight",
        "category": "dark",
        "categoryLabel": "Modern Dark",
        "desc": "Modern dark palette featuring #bd93f9 highlights.",
        "swatches": [
            "#1e1f29",
            "#282a36",
            "#bd93f9",
            "#ff79c6"
        ]
    },
    {
        "id": "one-dark-pro",
        "name": "One Dark Pro",
        "category": "dark",
        "categoryLabel": "Modern Dark",
        "desc": "Modern dark palette featuring #61afef highlights.",
        "swatches": [
            "#21252b",
            "#282c34",
            "#61afef",
            "#98c379"
        ]
    },
    {
        "id": "nord-frost",
        "name": "Nord Frost",
        "category": "dark",
        "categoryLabel": "Modern Dark",
        "desc": "Modern dark palette featuring #88c0d0 highlights.",
        "swatches": [
            "#242933",
            "#2e3440",
            "#88c0d0",
            "#8fbcbb"
        ]
    },
    {
        "id": "deep-space",
        "name": "Deep Space Nebula",
        "category": "dark",
        "categoryLabel": "Modern Dark",
        "desc": "Modern dark palette featuring #8b5cf6 highlights.",
        "swatches": [
            "#060913",
            "#0c1222",
            "#8b5cf6",
            "#38bdf8"
        ]
    },
    {
        "id": "moonlight-slate",
        "name": "Moonlight Slate",
        "category": "dark",
        "categoryLabel": "Modern Dark",
        "desc": "Modern dark palette featuring #38bdf8 highlights.",
        "swatches": [
            "#11141a",
            "#181d26",
            "#38bdf8",
            "#94a3b8"
        ]
    },
    {
        "id": "midnight-cobalt",
        "name": "Midnight Cobalt",
        "category": "dark",
        "categoryLabel": "Modern Dark",
        "desc": "Modern dark palette featuring #0096ff highlights.",
        "swatches": [
            "#050d1a",
            "#0a1931",
            "#0096ff",
            "#00e5ff"
        ]
    },
    {
        "id": "cyber-charcoal",
        "name": "Cyber Charcoal",
        "category": "dark",
        "categoryLabel": "Modern Dark",
        "desc": "Modern dark palette featuring #f97316 highlights.",
        "swatches": [
            "#121214",
            "#1a1a1e",
            "#f97316",
            "#fb923c"
        ]
    },
    {
        "id": "eclipse-black",
        "name": "Eclipse Black",
        "category": "dark",
        "categoryLabel": "Modern Dark",
        "desc": "Modern dark palette featuring #e11d48 highlights.",
        "swatches": [
            "#000000",
            "#0a0a0a",
            "#e11d48",
            "#f43f5e"
        ]
    },
    {
        "id": "cyberpunk-2077",
        "name": "Cyberpunk 2077",
        "category": "cyber",
        "categoryLabel": "Cyber & Retro",
        "desc": "Retro cyberpunk tech styling with vivid electric contrast.",
        "swatches": [
            "#0d0221",
            "#19053b",
            "#fcee0a",
            "#00f0ff"
        ]
    },
    {
        "id": "synthwave-sunset",
        "name": "Synthwave Sunset",
        "category": "cyber",
        "categoryLabel": "Cyber & Retro",
        "desc": "Retro cyberpunk tech styling with vivid electric contrast.",
        "swatches": [
            "#1a0b2e",
            "#261245",
            "#ff2a6d",
            "#05d9e8"
        ]
    },
    {
        "id": "matrix-terminal",
        "name": "Matrix Terminal",
        "category": "cyber",
        "categoryLabel": "Cyber & Retro",
        "desc": "Retro cyberpunk tech styling with vivid electric contrast.",
        "swatches": [
            "#030a04",
            "#061508",
            "#00ff41",
            "#008f11"
        ]
    },
    {
        "id": "amber-crt",
        "name": "Amber Vintage Terminal",
        "category": "cyber",
        "categoryLabel": "Cyber & Retro",
        "desc": "Retro cyberpunk tech styling with vivid electric contrast.",
        "swatches": [
            "#0d0800",
            "#1a1002",
            "#ffb000",
            "#ff8000"
        ]
    },
    {
        "id": "cyan-circuit",
        "name": "Cyan Circuit",
        "category": "cyber",
        "categoryLabel": "Cyber & Retro",
        "desc": "Retro cyberpunk tech styling with vivid electric contrast.",
        "swatches": [
            "#021217",
            "#041f26",
            "#00f5ff",
            "#00b4d8"
        ]
    },
    {
        "id": "electric-violet",
        "name": "Electric Violet",
        "category": "cyber",
        "categoryLabel": "Cyber & Retro",
        "desc": "Retro cyberpunk tech styling with vivid electric contrast.",
        "swatches": [
            "#130324",
            "#20073b",
            "#a855f7",
            "#d946ef"
        ]
    },
    {
        "id": "hyperdrive-laser",
        "name": "Hyperdrive Laser",
        "category": "cyber",
        "categoryLabel": "Cyber & Retro",
        "desc": "Retro cyberpunk tech styling with vivid electric contrast.",
        "swatches": [
            "#140505",
            "#240a0a",
            "#ef4444",
            "#f97316"
        ]
    },
    {
        "id": "quantum-plasma",
        "name": "Quantum Plasma",
        "category": "cyber",
        "categoryLabel": "Cyber & Retro",
        "desc": "Retro cyberpunk tech styling with vivid electric contrast.",
        "swatches": [
            "#030814",
            "#07122b",
            "#22c55e",
            "#06b6d4"
        ]
    },
    {
        "id": "swiss-minimal",
        "name": "Swiss Minimal White",
        "category": "light",
        "categoryLabel": "Minimalist Light",
        "desc": "Clean minimalist light mode designed for crisp readability.",
        "swatches": [
            "#f8f9fa",
            "#ffffff",
            "#e11d48",
            "#0f172a"
        ]
    },
    {
        "id": "cupertino-clean",
        "name": "Cupertino Clean",
        "category": "light",
        "categoryLabel": "Minimalist Light",
        "desc": "Clean minimalist light mode designed for crisp readability.",
        "swatches": [
            "#f5f5f7",
            "#ffffff",
            "#0071e3",
            "#2c2c2e"
        ]
    },
    {
        "id": "monochrome-exec",
        "name": "Monochrome Executive",
        "category": "light",
        "categoryLabel": "Minimalist Light",
        "desc": "Clean minimalist light mode designed for crisp readability.",
        "swatches": [
            "#ffffff",
            "#f4f4f5",
            "#18181b",
            "#52525b"
        ]
    },
    {
        "id": "cloud-silver",
        "name": "Cloud Silver",
        "category": "light",
        "categoryLabel": "Minimalist Light",
        "desc": "Clean minimalist light mode designed for crisp readability.",
        "swatches": [
            "#f1f5f9",
            "#ffffff",
            "#0ea5e9",
            "#64748b"
        ]
    },
    {
        "id": "paper-ivory",
        "name": "Paper Ivory",
        "category": "light",
        "categoryLabel": "Minimalist Light",
        "desc": "Clean minimalist light mode designed for crisp readability.",
        "swatches": [
            "#fbf7ee",
            "#fffdf9",
            "#b45309",
            "#78350f"
        ]
    },
    {
        "id": "nordic-birch",
        "name": "Nordic Birch",
        "category": "light",
        "categoryLabel": "Minimalist Light",
        "desc": "Clean minimalist light mode designed for crisp readability.",
        "swatches": [
            "#f4f6f0",
            "#ffffff",
            "#2e7d32",
            "#558b2f"
        ]
    },
    {
        "id": "soft-ash",
        "name": "Soft Ash",
        "category": "light",
        "categoryLabel": "Minimalist Light",
        "desc": "Clean minimalist light mode designed for crisp readability.",
        "swatches": [
            "#f0f2f5",
            "#ffffff",
            "#f43f5e",
            "#475569"
        ]
    },
    {
        "id": "crisp-horizon",
        "name": "Crisp Horizon",
        "category": "light",
        "categoryLabel": "Minimalist Light",
        "desc": "Clean minimalist light mode designed for crisp readability.",
        "swatches": [
            "#f8fafc",
            "#ffffff",
            "#0e7490",
            "#0284c7"
        ]
    },
    {
        "id": "emerald-forest",
        "name": "Emerald Forest",
        "category": "earth",
        "categoryLabel": "Nature & Earth",
        "desc": "Organic, warm earth & botanical tones inspired by nature.",
        "swatches": [
            "#05140b",
            "#0a2414",
            "#10b981",
            "#34d399"
        ]
    },
    {
        "id": "gruvbox-earth",
        "name": "Gruvbox Warm Earth",
        "category": "earth",
        "categoryLabel": "Nature & Earth",
        "desc": "Organic, warm earth & botanical tones inspired by nature.",
        "swatches": [
            "#1d2021",
            "#282828",
            "#fe8019",
            "#fabd2f"
        ]
    },
    {
        "id": "espresso-mocha",
        "name": "Espresso Mocha",
        "category": "earth",
        "categoryLabel": "Nature & Earth",
        "desc": "Organic, warm earth & botanical tones inspired by nature.",
        "swatches": [
            "#18110b",
            "#241a12",
            "#d97706",
            "#fbbf24"
        ]
    },
    {
        "id": "bamboo-sage",
        "name": "Bamboo Sage",
        "category": "earth",
        "categoryLabel": "Nature & Earth",
        "desc": "Organic, warm earth & botanical tones inspired by nature.",
        "swatches": [
            "#111a14",
            "#18261e",
            "#84cc16",
            "#a3e635"
        ]
    },
    {
        "id": "autumn-amber",
        "name": "Autumn Amber",
        "category": "earth",
        "categoryLabel": "Nature & Earth",
        "desc": "Organic, warm earth & botanical tones inspired by nature.",
        "swatches": [
            "#1c0e09",
            "#2b170f",
            "#ea580c",
            "#f59e0b"
        ]
    },
    {
        "id": "desert-dune",
        "name": "Desert Dune",
        "category": "earth",
        "categoryLabel": "Nature & Earth",
        "desc": "Organic, warm earth & botanical tones inspired by nature.",
        "swatches": [
            "#17120c",
            "#261e14",
            "#f59e0b",
            "#fbbf24"
        ]
    },
    {
        "id": "rose-pine",
        "name": "Ros\u00c3\u00a9 Pine",
        "category": "earth",
        "categoryLabel": "Nature & Earth",
        "desc": "Organic, warm earth & botanical tones inspired by nature.",
        "swatches": [
            "#191724",
            "#1f1d2e",
            "#eb6f92",
            "#9ccfd8"
        ]
    },
    {
        "id": "royal-velvet",
        "name": "Royal Velvet",
        "category": "vibrant",
        "categoryLabel": "Vibrant & Neon",
        "desc": "High-energy glowing gradients and hyper-saturated accents.",
        "swatches": [
            "#140728",
            "#220c42",
            "#d946ef",
            "#facc15"
        ]
    },
    {
        "id": "aurora-borealis",
        "name": "Aurora Borealis",
        "category": "vibrant",
        "categoryLabel": "Vibrant & Neon",
        "desc": "High-energy glowing gradients and hyper-saturated accents.",
        "swatches": [
            "#06101e",
            "#0b1e38",
            "#2dd4bf",
            "#a78bfa"
        ]
    },
    {
        "id": "sunset-horizon",
        "name": "Sunset Horizon",
        "category": "vibrant",
        "categoryLabel": "Vibrant & Neon",
        "desc": "High-energy glowing gradients and hyper-saturated accents.",
        "swatches": [
            "#17081d",
            "#270f30",
            "#f43f5e",
            "#fb923c"
        ]
    },
    {
        "id": "cosmic-fuchsia",
        "name": "Cosmic Fuchsia",
        "category": "vibrant",
        "categoryLabel": "Vibrant & Neon",
        "desc": "High-energy glowing gradients and hyper-saturated accents.",
        "swatches": [
            "#18031d",
            "#280730",
            "#ec4899",
            "#c084fc"
        ]
    },
    {
        "id": "solar-flare",
        "name": "Solar Flare",
        "category": "vibrant",
        "categoryLabel": "Vibrant & Neon",
        "desc": "High-energy glowing gradients and hyper-saturated accents.",
        "swatches": [
            "#180900",
            "#2b1100",
            "#f59e0b",
            "#ef4444"
        ]
    },
    {
        "id": "electric-mint",
        "name": "Electric Mint",
        "category": "vibrant",
        "categoryLabel": "Vibrant & Neon",
        "desc": "High-energy glowing gradients and hyper-saturated accents.",
        "swatches": [
            "#011411",
            "#03211c",
            "#34d399",
            "#2dd4bf"
        ]
    },
    {
        "id": "vaporwave-80s",
        "name": "Vaporwave 80s",
        "category": "vibrant",
        "categoryLabel": "Vibrant & Neon",
        "desc": "High-energy glowing gradients and hyper-saturated accents.",
        "swatches": [
            "#170d2b",
            "#241442",
            "#ff71ce",
            "#01cdfe"
        ]
    }
];

let currentTemplateCategory = 'all';
let currentTemplateSearchQuery = '';

function setupTemplates() {
    // 1. Read stored template from localStorage, default to 'obsidian-pro'
    const savedTemplate = localStorage.getItem('portfolioTemplate') || 'obsidian-pro';
    applyTemplate(savedTemplate, false);

    // 2. Setup category filter button clicks
    const filterTabs = document.getElementById('templateFilterTabs');
    if (filterTabs) {
        filterTabs.addEventListener('click', (e) => {
            const btn = e.target.closest('.tpl-filter-btn');
            if (!btn) return;
            filterTabs.querySelectorAll('.tpl-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTemplateCategory = btn.getAttribute('data-category') || 'all';
            renderTemplatesGrid();
        });
    }

    // 3. Setup live search input
    const searchInput = document.getElementById('templateSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentTemplateSearchQuery = e.target.value.trim().toLowerCase();
            renderTemplatesGrid();
        });
    }

    // 4. Delegated click listener on templates grid
    const grid = document.getElementById('templatesGrid');
    if (grid) {
        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.template-card');
            if (!card) return;
            const themeId = card.getAttribute('data-id');
            if (themeId) {
                applyTemplate(themeId, true);
            }
        });
    }

    // 5. Initial render of the grid
    renderTemplatesGrid();
}

function applyTemplate(themeId, showNotification = true) {
    const valid = PORTFOLIO_TEMPLATES.find(t => t.id === themeId);
    const resolvedId = valid ? themeId : 'obsidian-pro';
    const themeObj = valid || PORTFOLIO_TEMPLATES[0];

    // Set data-theme on html, body, and all main containers
    document.documentElement.setAttribute('data-theme', resolvedId);
    if (document.body) {
        document.body.setAttribute('data-theme', resolvedId);
    }
    localStorage.setItem('portfolioTemplate', resolvedId);

    // Update active state in grid cards
    const allCards = document.querySelectorAll('.template-card');
    allCards.forEach(card => {
        if (card.getAttribute('data-id') === resolvedId) {
            card.classList.add('active-theme');
            const badge = card.querySelector('.template-active-badge');
            if (badge) badge.style.display = 'inline-flex';
            const btnSpan = card.querySelector('.template-apply-btn span');
            if (btnSpan) btnSpan.textContent = 'Selected';
        } else {
            card.classList.remove('active-theme');
            const badge = card.querySelector('.template-active-badge');
            if (badge) badge.style.display = 'none';
            const btnSpan = card.querySelector('.template-apply-btn span');
            if (btnSpan) btnSpan.textContent = 'Use Template';
        }
    });

    if (showNotification) {
        showToast(`Template switched to "${themeObj.name}"!`, 'success');
    }
}

// Expose globally to window
window.applyTemplate = applyTemplate;

function renderTemplatesGrid() {
    const grid = document.getElementById('templatesGrid');
    const badge = document.getElementById('templateCountBadge');
    if (!grid) return;

    const activeThemeId = document.documentElement.getAttribute('data-theme') || localStorage.getItem('portfolioTemplate') || 'obsidian-pro';

    const filtered = PORTFOLIO_TEMPLATES.filter(tpl => {
        const matchesCategory = currentTemplateCategory === 'all' || tpl.category === currentTemplateCategory;
        const matchesSearch = !currentTemplateSearchQuery || 
            tpl.name.toLowerCase().includes(currentTemplateSearchQuery) ||
            tpl.categoryLabel.toLowerCase().includes(currentTemplateSearchQuery) ||
            tpl.desc.toLowerCase().includes(currentTemplateSearchQuery) ||
            tpl.id.toLowerCase().includes(currentTemplateSearchQuery);
        return matchesCategory && matchesSearch;
    });

    if (badge) {
        badge.textContent = `${filtered.length} of ${PORTFOLIO_TEMPLATES.length} Themes`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--text-dim);">
                <i class="fa-solid fa-palette" style="font-size: 2.2rem; margin-bottom: 12px; display: block; opacity: 0.5;"></i>
                <p style="font-size: 1rem; margin-bottom: 6px;">No templates found matching "<strong>${escapeHtml(currentTemplateSearchQuery)}</strong>"</p>
                <button class="btn btn-secondary btn-sm" onclick="document.getElementById('templateSearchInput').value=''; currentTemplateSearchQuery=''; renderTemplatesGrid();">
                    Clear Search
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(tpl => {
        const isActive = tpl.id === activeThemeId;
        const swatchesHtml = tpl.swatches.map(color => `
            <div class="template-swatch" style="background-color: ${color};" title="${color}"></div>
        `).join('');

        return `
            <div class="template-card ${isActive ? 'active-theme' : ''}" data-id="${tpl.id}">
                <div class="template-card-header">
                    <div class="template-swatches-row">
                        ${swatchesHtml}
                    </div>
                    <span class="template-category-tag">${escapeHtml(tpl.categoryLabel)}</span>
                </div>
                <div class="template-card-body">
                    <div class="template-name-row">
                        <h4 class="template-name">${escapeHtml(tpl.name)}</h4>
                        <span class="template-active-badge" style="display: ${isActive ? 'inline-flex' : 'none'};">
                            <i class="fa-solid fa-circle-check"></i> Active
                        </span>
                    </div>
                    <p class="template-desc">${escapeHtml(tpl.desc)}</p>
                </div>
                <div class="template-card-footer">
                    <button class="template-apply-btn" type="button">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        <span>${isActive ? 'Selected' : 'Use Template'}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}
