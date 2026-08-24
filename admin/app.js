(function () {
    const authCard = document.getElementById('authCard');
    const dashboardCard = document.getElementById('dashboardCard');
    const authMessage = document.getElementById('authMessage');
    const dashboardList = document.getElementById('dashboardList');
    const mailboxList = document.getElementById('mailboxList');
    const dashboardEmptyState = document.getElementById('dashboardEmptyState');
    const mailboxEmptyState = document.getElementById('mailboxEmptyState');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const updateEmailForm = document.getElementById('updateEmailForm');
    const updatePasswordForm = document.getElementById('updatePasswordForm');
    const settingsMessage = document.getElementById('settingsMessage');
    const currentAdminEmail = document.getElementById('currentAdminEmail');
    const dashboardDetail = document.getElementById('dashboardDetail');
    const allCount = document.getElementById('allCount');
    const newCount = document.getElementById('newCount');
    const progressCount = document.getElementById('progressCount');
    const resolvedCount = document.getElementById('resolvedCount');
    const dashboardView = document.getElementById('dashboardView');
    const mailboxView = document.getElementById('mailboxView');
    const settingsView = document.getElementById('settingsView');
    const mailboxTitle = document.getElementById('mailboxTitle');
    const mailboxPagination = document.getElementById('mailboxPagination');
    const mailboxPageInfo = document.getElementById('mailboxPageInfo');
    const mailboxPrevBtn = document.getElementById('mailboxPrevBtn');
    const mailboxNextBtn = document.getElementById('mailboxNextBtn');
    const viewToggles = Array.from(document.querySelectorAll('.view-toggle'));
    const messageModal = document.getElementById('messageModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const replyModal = document.getElementById('replyModal');
    const replyModalBackdrop = document.getElementById('replyModalBackdrop');
    const closeReplyModalBtn = document.getElementById('closeReplyModalBtn');
    const replyForm = document.getElementById('replyForm');
    const replyTargetId = document.getElementById('replyTargetId');
    const replyToEmail = document.getElementById('replyToEmail');
    const replySubject = document.getElementById('replySubject');
    const replyMessage = document.getElementById('replyMessage');
    const replyMessageStatus = document.getElementById('replyMessageStatus');
    const adminThemeToggle = document.getElementById('adminThemeToggle');
    const adminThemeIcon = document.getElementById('adminThemeIcon');
    const navPills = Array.from(document.querySelectorAll('.nav-pill[data-view]'));
    const adminShell = document.querySelector('.admin-shell');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    let actionModal = document.getElementById('actionModal');
    let actionModalTitle = document.getElementById('actionModalTitle');
    let actionModalText = document.getElementById('actionModalText');
    let actionModalIcon = document.getElementById('actionModalIcon');
    let actionModalCancel = document.getElementById('actionModalCancel');
    let actionModalConfirm = document.getElementById('actionModalConfirm');
    const SEND_REPLY_FUNCTION_URL = 'YOUR_SEND_REPLY_FUNCTION_URL';
    const MOBILE_SIDEBAR_BREAKPOINT = 1080;
    let statusBound = false;
    let starBound = false;
    let rowActionBound = false;
    let unsubscribeInquiries = null;
    let settingsBound = false;
    let replyBound = false;
	let settingsTabsBound = false;
    let latestSnapshot = null;
    let menuZIndexCounter = 7000;
    let viewModeByScope = {
        dashboard: 'list',
        mailbox: 'list'
    };
    let activeView = 'dashboard';
    let selectedDashboardInquiryId = null;
    let currentAdminUserEmail = '';
    const MAILBOX_PAGE_SIZE = 5;
    const paginatedMailboxViews = new Set(['inbox', 'starred', 'sent', 'archive']);
    let mailboxPageByView = {
        inbox: 1,
        starred: 1,
        sent: 1,
        archive: 1
    };

    function getFirebaseAuth() {
        const db = window.InquiryService?.getDb();
        if (!db || !window.firebase?.auth) return null;
        return window.firebase.auth();
    }

    /**
     * Firebase Auth often returns auth/invalid-credential for wrong password or unknown user (email enumeration protection).
     * @param {Error & { code?: string }} error
     * @param {'login' | 'reauth'} context
     */
    function formatFirebaseAuthError(error, context) {
        const code = error && error.code;
        if (code === 'auth/invalid-credential') {
            if (context === 'login') {
                return 'Wrong email or password.';
            }
            if (context === 'reauth') {
                return 'Wrong current password.';
            }
        }
        if (code === 'auth/operation-not-allowed') {
            return 'Email/password sign-in is disabled in Firebase.';
        }
        if (code === 'auth/unauthorized-domain') {
            return 'This domain is not allowed for sign-in.';
        }
        if (code === 'auth/wrong-password') {
            return context === 'reauth' ? 'Wrong current password.' : 'Wrong password.';
        }
        if (code === 'auth/user-not-found') {
            return 'No account for this email.';
        }
        if (code === 'auth/invalid-email') {
            return 'Invalid email.';
        }
        if (code === 'auth/user-disabled') {
            return 'This account is disabled.';
        }
        if (code === 'auth/too-many-requests') {
            return 'Too many attempts. Try again later.';
        }
        return context === 'reauth' ? 'Update failed.' : 'Sign-in failed.';
    }

    function updateThemeIcon(theme) {
        if (!adminThemeIcon) return;
        adminThemeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    function applySavedTheme() {
        const html = document.documentElement;
        const savedTheme = localStorage.getItem('adminTheme') || localStorage.getItem('theme') || 'light';
        const savedPalette = localStorage.getItem('adminPalette') || 'purple';
        html.setAttribute('data-theme', savedTheme);
        html.setAttribute('data-palette', savedPalette);
        updateThemeIcon(savedTheme);
    }
    function applyPalette(palette) {
        const html = document.documentElement;
        const next = palette || 'purple';
        html.setAttribute('data-palette', next);
        localStorage.setItem('adminPalette', next);
    }

    function isMobileSidebarLayout() {
        return window.innerWidth <= MOBILE_SIDEBAR_BREAKPOINT;
    }

    function closeSidebarMenu() {
        if (!adminShell) return;
        adminShell.classList.remove('sidebar-open');
        document.body.classList.remove('sidebar-open-lock');
        if (sidebarToggle) {
            sidebarToggle.classList.remove('is-open');
            sidebarToggle.setAttribute('aria-expanded', 'false');
        }
        if (sidebarBackdrop) sidebarBackdrop.classList.add('hidden');
    }

    function openSidebarMenu() {
        if (!adminShell || !isMobileSidebarLayout()) return;
        adminShell.classList.add('sidebar-open');
        document.body.classList.add('sidebar-open-lock');
        if (sidebarToggle) {
            sidebarToggle.classList.add('is-open');
            sidebarToggle.setAttribute('aria-expanded', 'true');
        }
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('hidden');
    }

    function buildFallbackComposeUrl(toEmail, subject, message) {
        const encodedTo = encodeURIComponent(toEmail);
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(message);
        return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    }

    async function sendReplyEmailViaFunction(payload) {
        if (SEND_REPLY_FUNCTION_URL === 'YOUR_SEND_REPLY_FUNCTION_URL') {
            return {
                success: false,
                fallbackMode: true,
                message: 'Cloud function URL is not configured.'
            };
        }

        const auth = getFirebaseAuth();
        const user = auth?.currentUser;
        if (!user) throw new Error('No authenticated admin session found.');

        const idToken = await user.getIdToken();
        const response = await fetch(SEND_REPLY_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success !== true) {
            throw new Error(result.message || `Reply email failed (HTTP ${response.status})`);
        }

        return result;
    }

    function formatDate(value) {
        if (!value) return 'Pending timestamp';
        if (typeof value.toDate === 'function') return value.toDate().toLocaleString();
        return new Date(value).toLocaleString();
    }

    function formatCompactDateTime(value) {
        if (!value) return 'Pending timestamp';
        const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    function ensureActionModalElements() {
        if (actionModal && actionModalTitle && actionModalText && actionModalIcon && actionModalCancel && actionModalConfirm) {
            return true;
        }

        if (!actionModal) {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <div class="confirmation-modal" id="actionModal" role="dialog" aria-modal="true" aria-labelledby="actionModalTitle">
                    <div class="confirmation-content">
                        <div class="confirmation-icon" id="actionModalIcon"><i class="fa-solid fa-circle-info"></i></div>
                        <h3 id="actionModalTitle">Please confirm</h3>
                        <p id="actionModalText"></p>
                        <div class="confirmation-actions">
                            <button type="button" id="actionModalCancel" class="confirmation-btn confirmation-btn-cancel">Cancel</button>
                            <button type="button" id="actionModalConfirm" class="confirmation-btn confirmation-btn-confirm">OK</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(wrapper.firstElementChild);
        }

        actionModal = document.getElementById('actionModal');
        actionModalTitle = document.getElementById('actionModalTitle');
        actionModalText = document.getElementById('actionModalText');
        actionModalIcon = document.getElementById('actionModalIcon');
        actionModalCancel = document.getElementById('actionModalCancel');
        actionModalConfirm = document.getElementById('actionModalConfirm');

        return Boolean(actionModal && actionModalTitle && actionModalText && actionModalIcon && actionModalCancel && actionModalConfirm);
    }

    function showActionModal(options = {}) {
        const title = options.title || 'Please confirm';
        const text = options.text || '';
        const kind = options.kind || 'info';
        const showCancel = options.showCancel !== false;
        const confirmText = options.confirmText || 'OK';
        const cancelText = options.cancelText || 'Cancel';
        const closeOnBackdrop = options.closeOnBackdrop !== false;

        if (!ensureActionModalElements()) return Promise.resolve(false);

        const iconClassByKind = {
            warning: 'fa-solid fa-triangle-exclamation',
            success: 'fa-solid fa-circle-check',
            error: 'fa-solid fa-circle-xmark',
            info: 'fa-solid fa-circle-info'
        };

        actionModalTitle.textContent = title;
        actionModalText.textContent = text;
        actionModalIcon.innerHTML = `<i class="${iconClassByKind[kind] || iconClassByKind.info}"></i>`;
        actionModalIcon.className = `confirmation-icon is-${kind}`;
        actionModalCancel.textContent = cancelText;
        actionModalConfirm.textContent = confirmText;
        actionModalCancel.classList.toggle('hidden', !showCancel);
        actionModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        return new Promise((resolve) => {
            const onClose = (result) => {
                actionModal.classList.remove('active');
                document.body.style.overflow = '';
                actionModalConfirm.removeEventListener('click', onConfirm);
                actionModalCancel.removeEventListener('click', onCancel);
                actionModal.removeEventListener('click', onBackdropClick);
                document.removeEventListener('keydown', onEscape);
                resolve(result);
            };
            const onConfirm = () => onClose(true);
            const onCancel = () => onClose(false);
            const onBackdropClick = (event) => {
                if (closeOnBackdrop && event.target === actionModal) onClose(false);
            };
            const onEscape = (event) => {
                if (event.key === 'Escape') onClose(false);
            };

            actionModalConfirm.addEventListener('click', onConfirm);
            actionModalCancel.addEventListener('click', onCancel);
            actionModal.addEventListener('click', onBackdropClick);
            document.addEventListener('keydown', onEscape);
        });
    }

    function installAlertInterceptor() {
        // Ensure unexpected native alerts in admin are rendered with the styled modal.
        window.alert = function interceptedAlert(message) {
            showActionModal({
                title: 'Notice',
                text: String(message || ''),
                kind: 'info',
                showCancel: false,
                confirmText: 'OK'
            });
        };
    }

    function setStarButtonState(starBtn, isStarred) {
        if (!starBtn) return;
        starBtn.setAttribute('data-starred', isStarred ? 'true' : 'false');
        starBtn.setAttribute('title', isStarred ? 'Unstar' : 'Star');
        starBtn.classList.toggle('is-starred', isStarred);
        const icon = starBtn.querySelector('.star-icon');
        if (icon) {
            icon.classList.toggle('fa-solid', isStarred);
            icon.classList.toggle('fa-regular', !isStarred);
        }
    }

    function getViewContext() {
        if (activeView === 'dashboard' || activeView === 'settings') return 'inbox';
        return activeView;
    }

    function getRowMenuMarkup(doc) {
        const data = doc.data();
        const id = doc.id;
        const inferredFolder = data.folder || (data.direction === 'outgoing' ? 'sent' : 'inbox');
        const folder = inferredFolder;
        const viewContext = getViewContext();
        const isTrash = folder === 'trash';
        const isRead = Boolean(data.isRead);
        const actions = [];

        if (isTrash) {
            actions.push('<button type="button" class="row-action" data-action="recover" data-id="' + id + '"><i class="fa-solid fa-rotate-left"></i> Recover</button>');
            actions.push('<button type="button" class="row-action danger" data-action="full-delete" data-id="' + id + '"><i class="fa-solid fa-trash"></i> Delete Permanently</button>');
            return actions.join('');
        }

        if (folder === 'archive') {
            actions.push('<button type="button" class="row-action" data-action="unarchive" data-id="' + id + '"><i class="fa-solid fa-inbox"></i> Unarchive (Move to Inbox)</button>');
        } else if (folder === 'inbox' && viewContext !== 'inbox') {
            actions.push('<button type="button" class="row-action" data-action="inbox" data-id="' + id + '"><i class="fa-solid fa-inbox"></i> Move to Inbox</button>');
        }

        if (folder !== 'archive' && viewContext !== 'archive') {
            actions.push('<button type="button" class="row-action" data-action="archive" data-id="' + id + '"><i class="fa-solid fa-box-archive"></i> Move to Archive</button>');
        }

        if (viewContext === 'inbox' || folder === 'inbox') {
            actions.push('<button type="button" class="row-action" data-action="' + (isRead ? 'mark-unread' : 'mark-read') + '" data-id="' + id + '"><i class="fa-regular fa-envelope' + (isRead ? '' : '-open') + '"></i> Mark as ' + (isRead ? 'Unread' : 'Read') + '</button>');
        }

        if (folder !== 'sent') {
            actions.push('<button type="button" class="row-action" data-action="reply" data-id="' + id + '"><i class="fa-solid fa-reply"></i> Reply</button>');
            actions.push('<button type="button" class="row-action" data-action="mark-gmail-replied" data-id="' + id + '"><i class="fa-solid fa-envelope-circle-check"></i> Mark Replied in Gmail</button>');
        }

        if (folder !== 'trash') {
            actions.push('<button type="button" class="row-action danger" data-action="trash" data-id="' + id + '"><i class="fa-regular fa-trash-can"></i> Move to Trash</button>');
        }

        return actions.join('');
    }

	function applyStatusSelectAppearance(selectNode) {
		if (!selectNode) return;
		const value = selectNode.value || 'new';
		selectNode.setAttribute('data-status', value);
	}

	// Cute custom dropdown (visual only) that mirrors the native select for a11y/events
	let statusDropdownsEnhanced = false;
	function closeAllStatusDropdowns() {
		document.querySelectorAll('.status-select-wrap.status-select-open').forEach((wrap) => {
			wrap.classList.remove('status-select-open');
		});
	}

	function enhanceStatusSelect(selectNode) {
		if (!selectNode || selectNode.dataset.enhanced === 'true') return;
		selectNode.dataset.enhanced = 'true';
		applyStatusSelectAppearance(selectNode);

		const currentValue = selectNode.value || 'new';
		const getLabel = (val) => {
			if (val === 'in-progress') return 'In Progress';
			if (val === 'resolved') return 'Resolved';
			return 'New';
		};
		const getEmoji = (val) => {
			if (val === 'in-progress') return '🧵';
			if (val === 'resolved') return '✅';
			return '🌸';
		};

		const wrap = document.createElement('div');
		wrap.className = 'status-select-wrap';

		const display = document.createElement('button');
		display.type = 'button';
		display.className = 'status-display';
		display.setAttribute('data-status', currentValue);
		display.innerHTML = `
			<span class="status-dot" aria-hidden="true"></span>
			<span class="status-label">${getEmoji(currentValue)} ${getLabel(currentValue)}</span>
			<span class="status-chevron" aria-hidden="true">▾</span>
		`;

		const list = document.createElement('div');
		list.className = 'status-options';
		list.innerHTML = `
			<button type="button" class="status-option" data-value="new">
				<span class="status-dot" aria-hidden="true"></span>
				<span class="opt-emoji" aria-hidden="true">🌸</span>
				<span>New</span>
			</button>
			<button type="button" class="status-option" data-value="in-progress">
				<span class="status-dot" aria-hidden="true"></span>
				<span class="opt-emoji" aria-hidden="true">🧵</span>
				<span>In Progress</span>
			</button>
			<button type="button" class="status-option" data-value="resolved">
				<span class="status-dot" aria-hidden="true"></span>
				<span class="opt-emoji" aria-hidden="true">✅</span>
				<span>Resolved</span>
			</button>
		`;

		// Insert wrapper before select and move select inside (visually hidden)
		selectNode.classList.add('visually-hidden-select');
		const parent = selectNode.parentNode;
		parent.insertBefore(wrap, selectNode);
		wrap.appendChild(display);
		// Keep list detachable for portal behavior; initially keep hidden inside wrap
		wrap.appendChild(list);
		wrap.appendChild(selectNode);

		const syncFromSelect = () => {
			const v = selectNode.value || 'new';
			display.setAttribute('data-status', v);
			display.querySelector('.status-label').textContent = `${getEmoji(v)} ${getLabel(v)}`;
			applyStatusSelectAppearance(selectNode);
		};

		// Portal rendering for options to avoid clipping and stacking issues
		let isOpen = false;
		let detachInfo = null; // { list, originalParent }
		const positionPortal = () => {
			if (!isOpen || !detachInfo) return;
			const rect = display.getBoundingClientRect();
			const docW = document.documentElement.clientWidth;
			const portal = detachInfo.list;
			const minWidth = Math.max(rect.width, 180);
			let left = rect.left;
			let top = rect.bottom + 8;
			// Keep within viewport horizontally
			if (left + minWidth > docW - 8) left = Math.max(8, docW - 8 - minWidth);
			portal.style.left = `${Math.round(left)}px`;
			portal.style.top = `${Math.round(top)}px`;
			portal.style.minWidth = `${Math.round(minWidth)}px`;
		};
		const handleScrollOrResize = () => positionPortal();
		const openPortal = () => {
			if (isOpen) return;
			isOpen = true;
			wrap.classList.add('status-select-open');
			// Detach list to body as portal
			detachInfo = { list, originalParent: wrap };
			list.classList.add('status-options-portal');
			document.body.appendChild(list);
			positionPortal();
			window.addEventListener('scroll', handleScrollOrResize, true);
			window.addEventListener('resize', handleScrollOrResize, true);
		};
		const closePortal = () => {
			if (!isOpen) return;
			isOpen = false;
			wrap.classList.remove('status-select-open');
			// Return list to original wrap and hide
			if (detachInfo) {
				detachInfo.originalParent.appendChild(list);
				list.classList.remove('status-options-portal');
				list.style.left = '';
				list.style.top = '';
				list.style.minWidth = '';
			}
			window.removeEventListener('scroll', handleScrollOrResize, true);
			window.removeEventListener('resize', handleScrollOrResize, true);
		};

		display.addEventListener('click', (e) => {
			e.stopPropagation();
			// Prevent row click -> modal
			const row = display.closest('.inquiry-item');
			if (row) e.stopImmediatePropagation?.();
			const wasOpen = wrap.classList.contains('status-select-open');
			closeAllStatusDropdowns();
			if (!wasOpen) {
				openPortal();
			} else {
				closePortal();
			}
		});

		list.addEventListener('click', (e) => {
			e.stopPropagation();
			const btn = e.target.closest('.status-option');
			if (!btn) return;
			const next = btn.getAttribute('data-value') || 'new';
			if (selectNode.value !== next) {
				selectNode.value = next;
				// Bubble change so our existing listener updates Firestore
				selectNode.dispatchEvent(new Event('change', { bubbles: true }));
			} else {
				// Still update visuals if same value clicked
				syncFromSelect();
			}
			closePortal();
		});

		// Keep visuals in sync if value is changed programmatically
		selectNode.addEventListener('change', syncFromSelect);
		syncFromSelect();

		if (!statusDropdownsEnhanced) {
			statusDropdownsEnhanced = true;
			document.addEventListener('click', () => {
				document.querySelectorAll('.status-select-wrap.status-select-open').forEach((node) => {
					const wrapNode = node;
					// Close each by simulating the local close (find display and call its portal close)
					const displayBtn = wrapNode.querySelector('.status-display');
					if (!displayBtn) return;
					wrapNode.classList.remove('status-select-open');
				});
				// Also ensure any orphaned portals are removed
				document.querySelectorAll('.status-options-portal').forEach((portal) => {
					const parentWrap = document.querySelector('.status-select-wrap.status-select-open');
					if (!parentWrap) {
						portal.remove();
					}
				});
			});
		}
	}

	function renderInquiry(doc, options = {}) {
        const data = doc.data();
        const isCompact = Boolean(options.compact);
        const folder = data.folder || (data.direction === 'outgoing' ? 'sent' : 'inbox');
        const safeStatus = data.status || 'new';
        const previewLimit = isCompact ? 60 : 110;
        const preview = (data.message || '').trim().slice(0, previewLimit);
        const createdLabel = isCompact ? formatCompactDateTime(data.createdAt) : formatDate(data.createdAt);
        const initial = (data.fullName || '?').trim().charAt(0).toUpperCase();
        const isStarred = Boolean(data.starred);
        const isResponded = Boolean(data.responded);
        const responseLabel = isResponded ? (data.respondedVia === 'gmail' ? 'Responded (Gmail)' : 'Responded') : 'No reply yet';
        const isRead = Boolean(data.isRead);
        const item = document.createElement('article');
        item.className = 'inquiry-item';
        if (isCompact) item.classList.add('is-compact');
        if (!isRead) item.classList.add('is-unread');
        item.setAttribute('data-id', doc.id);
        item.innerHTML = `
            <div class="inquiry-row">
                <div class="mail-tools">
                    <button type="button" class="star-toggle ${isStarred ? 'is-starred' : ''}" data-id="${doc.id}" data-starred="${isStarred ? 'true' : 'false'}" title="${isStarred ? 'Unstar' : 'Star'}">
                        <i class="fa-${isStarred ? 'solid' : 'regular'} fa-star star-icon"></i>
                    </button>
                    <span class="avatar-mark">${initial}</span>
                </div>
                <p class="mail-from truncate" title="${(data.fullName || 'No name').replace(/"/g, '&quot;')}">${data.fullName || 'No name'}</p>
                <p class="mail-subject-line">
                    <span class="subject-text truncate" title="${(data.subject || 'No subject').replace(/"/g, '&quot;')}">${data.subject || 'No subject'}</span>
                    <span class="mail-preview truncate" title="${((data.message || '').trim() || 'No message preview available.').replace(/"/g, '&quot;')}">${preview || 'No message preview available.'}${preview.length >= previewLimit ? '...' : ''}</span>
                </p>
                <div class="mail-meta-right">
                    ${isCompact
                        ? `<span class="mail-time truncate" title="${createdLabel.replace(/"/g, '&quot;')}">${createdLabel}</span>`
                        : `<div class="mail-controls-top">
                            <span class="response-badge truncate ${isResponded ? 'is-responded' : ''}" title="${responseLabel.replace(/"/g, '&quot;')}">${responseLabel}</span>
                            <span class="mail-time truncate" title="${createdLabel.replace(/"/g, '&quot;')}">${createdLabel}</span>
                            <div class="row-menu-wrap">
                                <button type="button" class="row-menu-trigger" title="More actions">
                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                </button>
                                <div class="row-menu">${getRowMenuMarkup(doc)}</div>
                            </div>
                        </div>
                        <div class="mail-controls-bottom">
                            <select data-id="${doc.id}" class="status-select">
                                <option value="new" ${safeStatus === 'new' ? 'selected' : ''}>New</option>
                                <option value="in-progress" ${safeStatus === 'in-progress' ? 'selected' : ''}>In Progress</option>
                                <option value="resolved" ${safeStatus === 'resolved' ? 'selected' : ''}>Resolved</option>
                            </select>
                        </div>`}
                </div>
            </div>
        `;
        const statusSelect = item.querySelector('.status-select');
        if (statusSelect) {
            statusSelect.addEventListener('click', (event) => event.stopPropagation());
			applyStatusSelectAppearance(statusSelect);
			statusSelect.addEventListener('change', () => applyStatusSelectAppearance(statusSelect));
			enhanceStatusSelect(statusSelect);
        }
        return item;
    }

    function getInquiryDetailMarkup(doc, options = {}) {
        const data = doc.data();
        const isStarred = Boolean(data.starred);
        const truncateBody = Boolean(options.truncateBody);
        const messageClass = truncateBody ? 'detail-message is-truncated' : 'detail-message';
        const includeInlineReply = Boolean(options.includeInlineReply);
        const inlineReplyMarkup = includeInlineReply && (data.folder || 'inbox') !== 'sent'
            ? `
                <form class="stack inline-reply-form" data-reply-id="${doc.id}">
                    <h4><i class="fa-solid fa-reply"></i> Reply</h4>
                    <label>To</label>
                    <input type="email" class="inline-reply-to" value="${data.email || ''}" required>
                    <label>Subject</label>
                    <input type="text" class="inline-reply-subject" value="Re: ${data.subject || 'No subject'}" required>
                    <label>Message</label>
                    <textarea class="inline-reply-message" rows="8" required placeholder="Write your reply here..."></textarea>
                    <button type="submit"><i class="fa-solid fa-paper-plane"></i> Send Reply</button>
                    <p class="message inline-reply-status"></p>
                </form>
            `
            : '';
        return `
            <div class="modal-head-row">
                <h3 id="modalSubject" class="subject-text"><i class="fa-regular fa-envelope-open"></i> ${data.subject || 'No subject'}</h3>
                <div class="modal-toolbar">
                    <select data-id="${doc.id}" class="status-select modal-status">
                        <option value="new" ${(data.status || 'new') === 'new' ? 'selected' : ''}>New</option>
                        <option value="in-progress" ${(data.status || 'new') === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="resolved" ${(data.status || 'new') === 'resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                    <button type="button" class="star-toggle ${isStarred ? 'is-starred' : ''}" data-id="${doc.id}" data-starred="${isStarred ? 'true' : 'false'}" title="${isStarred ? 'Unstar' : 'Star'}">
                        <i class="fa-${isStarred ? 'solid' : 'regular'} fa-star star-icon"></i>
                    </button>
                    <div class="row-menu-wrap">
                        <button type="button" class="row-menu-trigger" title="More actions">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <div class="row-menu">${getRowMenuMarkup(doc)}</div>
                    </div>
                </div>
            </div>
            <p class="meta">${data.fullName || 'No name'} • ${data.email || 'No email'} • ${formatDate(data.createdAt)}</p>
            <p class="${messageClass}">${data.message || ''}</p>
            ${inlineReplyMarkup}
        `;
    }

    function isInView(doc, viewName) {
        const data = doc.data();
        const folder = data.folder || (data.direction === 'outgoing' ? 'sent' : 'inbox');
        const isStarred = Boolean(data.starred);
        if (viewName === 'inbox') return folder === 'inbox';
        if (viewName === 'starred') return isStarred && folder !== 'trash';
        if (viewName === 'sent') return folder === 'sent';
        if (viewName === 'archive') return folder === 'archive';
        if (viewName === 'trash') return folder === 'trash';
        return true;
    }

    function getMailboxTitle(viewName) {
        if (viewName === 'starred') return '<i class="fa-regular fa-star"></i> Starred';
        if (viewName === 'sent') return '<i class="fa-regular fa-paper-plane"></i> Sent';
        if (viewName === 'archive') return '<i class="fa-solid fa-box-archive"></i> Archive';
        if (viewName === 'trash') return '<i class="fa-regular fa-trash-can"></i> Trash';
        return '<i class="fa-solid fa-inbox"></i> Inbox';
    }

    function isMailboxPaginatedView(viewName) {
        return paginatedMailboxViews.has(viewName);
    }

    function updateMailboxPaginationUi(currentPage, totalPages, shouldShow) {
        if (!mailboxPagination || !mailboxPageInfo || !mailboxPrevBtn || !mailboxNextBtn) return;
        mailboxPagination.classList.toggle('hidden', !shouldShow);
        if (!shouldShow) return;

        mailboxPageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        mailboxPrevBtn.disabled = currentPage <= 1;
        mailboxNextBtn.disabled = currentPage >= totalPages;
    }

    function setListMode(scope, mode) {
        const safeMode = mode === 'grid' ? 'grid' : 'list';
        viewModeByScope[scope] = safeMode;

        const listNode = scope === 'dashboard' ? dashboardList : mailboxList;
        listNode.classList.toggle('grid-view', safeMode === 'grid');

        viewToggles.forEach((toggle) => {
            if (toggle.getAttribute('data-scope') !== scope) return;
            const buttons = Array.from(toggle.querySelectorAll('.toggle-btn'));
            buttons.forEach((btn) => {
                btn.classList.toggle('active', btn.getAttribute('data-mode') === safeMode);
            });
        });
    }

    function openMessageModal(doc) {
        closeAllRowMenus();
        modalContent.innerHTML = getInquiryDetailMarkup(doc, { includeInlineReply: true });
		// Enhance modal status select appearance immediately
		const modalStatus = modalContent.querySelector('.modal-status');
		if (modalStatus) {
			applyStatusSelectAppearance(modalStatus);
			modalStatus.addEventListener('change', () => applyStatusSelectAppearance(modalStatus));
			enhanceStatusSelect(modalStatus);
		}
        messageModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeMessageModal() {
        messageModal.classList.add('hidden');
        modalContent.innerHTML = '';
        document.body.style.overflow = '';
    }

    function openReplyModal(doc) {
        const data = doc.data();
        replyTargetId.value = doc.id;
        replyToEmail.value = data.email || '';
        replySubject.value = `Re: ${data.subject || 'No subject'}`;
        replyMessage.value = '';
        replyMessageStatus.textContent = '';
        replyModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeReplyModal() {
        replyModal.classList.add('hidden');
        replyMessageStatus.textContent = '';
        document.body.style.overflow = '';
    }

    function closeAllRowMenus() {
        const menus = Array.from(document.querySelectorAll('.row-menu-wrap.open'));
        menus.forEach((node) => {
            node.classList.remove('open');
            node.style.zIndex = '';
            const row = node.closest('.inquiry-item');
            if (row) row.classList.remove('menu-open');
        });
    }

    function shouldRaiseMenu(wrap) {
        // Keep the row action menu above sibling rows in mailbox pages (including Archive).
        if (!['inbox', 'starred', 'sent', 'archive', 'trash'].includes(activeView)) return false;
        return Boolean(wrap && wrap.closest('#mailboxList'));
    }

    function updateStats(snapshot) {
        let newItems = 0;
        let inProgressItems = 0;
        let resolvedItems = 0;

        snapshot.forEach((doc) => {
            const status = doc.data().status || 'new';
            if (status === 'new') newItems += 1;
            if (status === 'in-progress') inProgressItems += 1;
            if (status === 'resolved') resolvedItems += 1;
        });

        allCount.textContent = String(snapshot.size);
        newCount.textContent = String(newItems);
        progressCount.textContent = String(inProgressItems);
        resolvedCount.textContent = String(resolvedItems);
    }

    function bindStatusUpdates(db) {
        if (statusBound) return;
        statusBound = true;
        dashboardCard.addEventListener('change', async (event) => {
            const target = event.target;
            if (!target.classList.contains('status-select')) return;

            const id = target.getAttribute('data-id');
            const status = target.value;

			// Update visual immediately
			applyStatusSelectAppearance(target);

            await db.collection('contactMessages').doc(id).update({
                status,
                updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
            });
        });
    }

    function bindStarUpdates(db) {
        if (starBound) return;
        starBound = true;
        dashboardCard.addEventListener('click', async (event) => {
            const starBtn = event.target.closest('.star-toggle');
            if (!starBtn) return;
            event.stopPropagation();

            const id = starBtn.getAttribute('data-id');
            const isStarred = starBtn.getAttribute('data-starred') === 'true';
            if (!id) return;

            // Optimistic UI so star state is visible immediately (including detail panes/modals).
            setStarButtonState(starBtn, !isStarred);

            await db.collection('contactMessages').doc(id).update({
                starred: !isStarred,
                updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
            });
        });
    }

    function getDocFromSnapshot(id) {
        if (!latestSnapshot) return null;
        return latestSnapshot.docs.find((doc) => doc.id === id) || null;
    }

    async function ensureSentRecordForInquiry(db, inquiryDoc, options = {}) {
        if (!inquiryDoc) return;
        const inquiryId = inquiryDoc.id;
        if (!inquiryId) return;

        const existing = await db.collection('contactMessages')
            .where('linkedInquiryId', '==', inquiryId)
            .where('folder', '==', 'sent')
            .limit(1)
            .get();
        if (!existing.empty) return;

        const inquiryData = inquiryDoc.data();
        await db.collection('contactMessages').add({
            folder: 'sent',
            direction: 'outgoing',
            linkedInquiryId: inquiryId,
            fullName: inquiryData.fullName || inquiryData.email || 'Recipient',
            email: inquiryData.email || '',
            subject: options.subject || `Re: ${inquiryData.subject || 'No subject'}`,
            message: options.message || 'Replied via Gmail.',
            status: 'resolved',
            starred: false,
            responded: true,
            respondedVia: options.respondedVia || 'gmail',
            sentBy: currentAdminUserEmail || 'admin',
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    function bindRowActions(db) {
        if (rowActionBound) return;
        rowActionBound = true;

        dashboardCard.addEventListener('click', async (event) => {
            const menuTrigger = event.target.closest('.row-menu-trigger');
            if (menuTrigger) {
                event.stopPropagation();
                const wrap = menuTrigger.closest('.row-menu-wrap');
                const shouldOpen = !wrap.classList.contains('open');
                closeAllRowMenus();
                wrap.classList.toggle('open', shouldOpen);
                if (shouldOpen && shouldRaiseMenu(wrap)) {
                    wrap.style.zIndex = String(menuZIndexCounter++);
                    const row = wrap.closest('.inquiry-item');
                    if (row) row.classList.add('menu-open');
                }
                return;
            }

            const actionBtn = event.target.closest('.row-action');
            if (actionBtn) {
                event.stopPropagation();
                const action = actionBtn.getAttribute('data-action');
                const id = actionBtn.getAttribute('data-id');
                if (!id) return;

                if (action === 'reply') {
                    const targetDoc = getDocFromSnapshot(id);
                    if (targetDoc) openReplyModal(targetDoc);
                    closeAllRowMenus();
                    return;
                }

                if (action === 'delete') {
                    await db.collection('contactMessages').doc(id).update({
                        folder: 'trash',
                        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                    });
                    closeAllRowMenus();
                    return;
                }

                if (action === 'trash') {
                    await db.collection('contactMessages').doc(id).update({
                        folder: 'trash',
                        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                    });
                    closeAllRowMenus();
                    return;
                }

                if (action === 'recover') {
                    await db.collection('contactMessages').doc(id).update({
                        folder: 'inbox',
                        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                    });
                    closeAllRowMenus();
                    return;
                }

                if (action === 'full-delete') {
                    const ok = await showActionModal({
                        title: 'Delete Permanently?',
                        text: 'This inquiry will be deleted forever and cannot be undone.',
                        kind: 'warning',
                        showCancel: true,
                        confirmText: 'Delete Permanently',
                        cancelText: 'Cancel'
                    });
                    if (!ok) {
                        closeAllRowMenus();
                        return;
                    }
                    try {
                        await db.collection('contactMessages').doc(id).delete();
                        if (selectedDashboardInquiryId === id) selectedDashboardInquiryId = null;
                        await showActionModal({
                            title: 'Deleted',
                            text: 'The inquiry was permanently deleted.',
                            kind: 'success',
                            showCancel: false,
                            confirmText: 'OK'
                        });
                    } catch (error) {
                        const extraHelp = String(error?.message || '').includes('Missing or insufficient permissions')
                            ? ' This is a Firestore Security Rules issue. Allow delete for your admin user in Firebase Console -> Firestore Database -> Rules.'
                            : '';
                        await showActionModal({
                            title: 'Delete Failed',
                            text: `Failed to delete permanently: ${error.message}${extraHelp}`,
                            kind: 'error',
                            showCancel: false,
                            confirmText: 'OK'
                        });
                    }
                    closeAllRowMenus();
                    return;
                }

                if (action === 'archive' || action === 'inbox') {
                    await db.collection('contactMessages').doc(id).update({
                        folder: action === 'archive' ? 'archive' : 'inbox',
                        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                    });
                    closeAllRowMenus();
                    return;
                }

                if (action === 'unarchive') {
                    await db.collection('contactMessages').doc(id).update({
                        folder: 'inbox',
                        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                    });
                    closeAllRowMenus();
                    return;
                }

                if (action === 'mark-read' || action === 'mark-unread') {
                    await db.collection('contactMessages').doc(id).update({
                        isRead: action === 'mark-read',
                        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                    });
                    closeAllRowMenus();
                    return;
                }

                if (action === 'mark-gmail-replied') {
                    const targetDoc = getDocFromSnapshot(id);
                    if (targetDoc) {
                        await ensureSentRecordForInquiry(db, targetDoc, {
                            respondedVia: 'gmail',
                            message: 'Replied via Gmail.'
                        });
                    }
                    await db.collection('contactMessages').doc(id).update({
                        responded: true,
                        respondedVia: 'gmail',
                        respondedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
                        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                    });
                    closeAllRowMenus();
                    return;
                }
            }

            closeAllRowMenus();
        });
    }

    async function sendReplyAndPersist(db, payload, statusNode, onSuccess) {
        const targetId = payload.targetId;
        const toEmail = payload.toEmail;
        const subject = payload.subject;
        const message = payload.message;
        const targetDoc = getDocFromSnapshot(targetId);
        const targetData = targetDoc ? targetDoc.data() : {};

        if (statusNode) statusNode.textContent = 'Sending email...';
        const sendResult = await sendReplyEmailViaFunction({
            inquiryId: targetId,
            toEmail,
            subject,
            message,
            fromEmail: currentAdminUserEmail || 'admin@local'
        });

        let respondedVia = 'website';
        let emailDelivery = 'sent';
        if (sendResult?.fallbackMode) {
            const composeUrl = buildFallbackComposeUrl(toEmail, subject, message);
            window.open(composeUrl, '_blank', 'noopener,noreferrer');
            const confirmedSent = await showActionModal({
                title: 'Confirm Gmail Send',
                text: 'No server email sender is configured yet (Blaze required). Gmail compose was opened. Click "I Sent It" only after sending the email in Gmail.',
                kind: 'warning',
                showCancel: true,
                confirmText: 'I Sent It',
                cancelText: 'Cancel'
            });
            if (!confirmedSent) {
                if (statusNode) statusNode.textContent = 'Email send cancelled. Reply was not saved.';
                return false;
            }
            respondedVia = 'gmail-manual';
            emailDelivery = 'manual-confirmed';
        }

        await db.collection('contactMessages').add({
            folder: 'sent',
            direction: 'outgoing',
            linkedInquiryId: targetId,
            fullName: targetData.fullName || toEmail,
            email: toEmail,
            subject,
            message,
            status: 'resolved',
            starred: false,
            responded: true,
            respondedVia,
            emailDelivery,
            sentBy: currentAdminUserEmail || 'admin',
            createdAt: window.firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });

        await db.collection('contactMessages').doc(targetId).update({
            responded: true,
            respondedVia,
            respondedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });

        if (statusNode) statusNode.textContent = '';
        if (typeof onSuccess === 'function') onSuccess();
        return true;
    }

    function bindReplyActions(db) {
        if (replyBound) return;
        replyBound = true;
        if (closeReplyModalBtn) closeReplyModalBtn.addEventListener('click', closeReplyModal);
        if (replyModalBackdrop) replyModalBackdrop.addEventListener('click', closeReplyModal);

        replyForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            replyMessageStatus.textContent = '';

            const targetId = replyTargetId.value;
            const toEmail = replyToEmail.value.trim();
            const subject = replySubject.value.trim();
            const message = replyMessage.value.trim();
            if (!targetId || !toEmail || !subject || !message) return;

            try {
                await sendReplyAndPersist(db, { targetId, toEmail, subject, message }, replyMessageStatus, closeReplyModal);
            } catch (error) {
                replyMessageStatus.textContent = `Failed to send reply email: ${error.message}`;
            }
        });
    }

    function subscribeToInquiries(db) {
        if (unsubscribeInquiries) unsubscribeInquiries();
        unsubscribeInquiries = db.collection('contactMessages')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                latestSnapshot = snapshot;
                updateStats(snapshot);
                renderDashboard(snapshot);
                renderMailbox(snapshot, activeView);
            }, (error) => {
                dashboardEmptyState.classList.remove('hidden');
                mailboxEmptyState.classList.remove('hidden');
                dashboardEmptyState.textContent = `Failed to load inquiries: ${error.message}`;
                mailboxEmptyState.textContent = `Failed to load inquiries: ${error.message}`;
            });
    }

    function renderDashboard(snapshot) {
        dashboardList.innerHTML = '';
        const recentDocs = snapshot.docs
            .filter((doc) => {
                const data = doc.data();
                const folder = data.folder || (data.direction === 'outgoing' ? 'sent' : 'inbox');
                const isOutgoing = data.direction === 'outgoing' || folder === 'sent';
                const isFromContactForm = data.source === 'portfolio-contact-form' || (!data.direction && folder !== 'sent');
                return !isOutgoing && isFromContactForm;
            })
            .slice(0, 5);
        setListMode('dashboard', viewModeByScope.dashboard);

        if (recentDocs.length === 0) {
            dashboardEmptyState.classList.remove('hidden');
            selectedDashboardInquiryId = null;
            dashboardDetail.innerHTML = '<p class="muted"><i class="fa-regular fa-hand-pointer"></i> Select a message to read details.</p>';
            return;
        }

        dashboardEmptyState.classList.add('hidden');
        const selectedDoc = recentDocs.find((doc) => doc.id === selectedDashboardInquiryId) || recentDocs[recentDocs.length - 1];
        selectedDashboardInquiryId = selectedDoc.id;
        dashboardDetail.innerHTML = getInquiryDetailMarkup(selectedDoc, { truncateBody: true });
		// Enhance status select in the right-side dashboard detail panel
		const detailStatus = dashboardDetail.querySelector('.status-select');
		if (detailStatus) {
			applyStatusSelectAppearance(detailStatus);
			detailStatus.addEventListener('change', () => applyStatusSelectAppearance(detailStatus));
			enhanceStatusSelect(detailStatus);
		}

        recentDocs.forEach((doc) => {
            const item = renderInquiry(doc, { compact: true });
            if (doc.id === selectedDashboardInquiryId) item.classList.add('selected');
            item.addEventListener('click', (event) => {
                if (event.target.closest('.star-toggle')) return;
                selectedDashboardInquiryId = doc.id;
                renderDashboard(snapshot);
            });
            dashboardList.appendChild(item);
        });
    }

    function renderMailbox(snapshot, viewName) {
        mailboxList.innerHTML = '';
        mailboxTitle.innerHTML = getMailboxTitle(viewName);
        setListMode('mailbox', viewModeByScope.mailbox);

        const filterView = viewName === 'dashboard' || viewName === 'settings' ? 'inbox' : viewName;
        const docs = snapshot.docs.filter((doc) => isInView(doc, filterView));
        const shouldPaginate = isMailboxPaginatedView(filterView);
        const totalPages = shouldPaginate ? Math.max(1, Math.ceil(docs.length / MAILBOX_PAGE_SIZE)) : 1;
        const savedPage = mailboxPageByView[filterView] || 1;
        const currentPage = shouldPaginate ? Math.min(savedPage, totalPages) : 1;
        if (shouldPaginate) mailboxPageByView[filterView] = currentPage;
        const startIndex = shouldPaginate ? (currentPage - 1) * MAILBOX_PAGE_SIZE : 0;
        const endIndex = shouldPaginate ? startIndex + MAILBOX_PAGE_SIZE : docs.length;
        const pagedDocs = docs.slice(startIndex, endIndex);
        updateMailboxPaginationUi(currentPage, totalPages, shouldPaginate && docs.length > 0);

        if (docs.length === 0) {
            mailboxEmptyState.classList.remove('hidden');
            updateMailboxPaginationUi(1, 1, false);
            return;
        }

        mailboxEmptyState.classList.add('hidden');
        pagedDocs.forEach((doc) => {
            const item = renderInquiry(doc);
            item.addEventListener('click', (event) => {
                if (event.target.closest('.star-toggle, .status-select, .row-menu-trigger, .row-menu, .row-action')) return;
                const data = doc.data();
                if (!data.isRead) {
                    item.classList.remove('is-unread');
                    window.InquiryService?.getDb()?.collection('contactMessages').doc(doc.id).update({
                        isRead: true,
                        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
                openMessageModal(doc);
            });
            mailboxList.appendChild(item);
        });
    }

    function showDashboard() {
        authCard.classList.add('hidden');
        dashboardCard.classList.remove('hidden');
    }

    function showAuth() {
        dashboardCard.classList.add('hidden');
        authCard.classList.remove('hidden');
        closeSidebarMenu();
    }

    function setActiveView(viewName) {
        activeView = viewName;
        const showSettings = viewName === 'settings';
        const showDashboard = viewName === 'dashboard';
        const showMailbox = !showSettings && !showDashboard;

        dashboardView.classList.toggle('hidden', !showDashboard);
        mailboxView.classList.toggle('hidden', !showMailbox);
        settingsView.classList.toggle('hidden', !showSettings);

        if (showDashboard && latestSnapshot) {
            renderDashboard(latestSnapshot);
        }

        if (showMailbox && latestSnapshot) {
            renderMailbox(latestSnapshot, viewName);
        }

        navPills.forEach((button) => {
            const isActive = button.getAttribute('data-view') === viewName;
            button.classList.toggle('active', isActive);
        });
    }

    function bindViewControls() {
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                if (adminShell?.classList.contains('sidebar-open')) {
                    closeSidebarMenu();
                } else {
                    openSidebarMenu();
                }
            });
        }

        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', closeSidebarMenu);
        }

        if (adminThemeToggle) {
            adminThemeToggle.addEventListener('click', () => {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme') || 'light';
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', nextTheme);
                localStorage.setItem('adminTheme', nextTheme);
                updateThemeIcon(nextTheme);
                // Sync settings mode radios if present
                const modeRadios = document.querySelectorAll('input[name="admin-mode"]');
                modeRadios.forEach((r) => {
                    if (r && r.value === nextTheme) r.checked = true;
                });
            });
        }

        navPills.forEach((button) => {
            button.addEventListener('click', () => {
                const view = button.getAttribute('data-view') || 'inbox';
                if (isMailboxPaginatedView(view)) mailboxPageByView[view] = 1;
                setActiveView(view);
                closeSidebarMenu();
            });
        });

        viewToggles.forEach((toggle) => {
            const scope = toggle.getAttribute('data-scope');
            const buttons = Array.from(toggle.querySelectorAll('.toggle-btn'));
            buttons.forEach((button) => {
                button.addEventListener('click', () => {
                    const mode = button.getAttribute('data-mode') || 'list';
                    setListMode(scope, mode);
                });
            });
        });

        if (mailboxPrevBtn) {
            mailboxPrevBtn.addEventListener('click', () => {
                const filterView = activeView === 'dashboard' || activeView === 'settings' ? 'inbox' : activeView;
                if (!isMailboxPaginatedView(filterView) || !latestSnapshot) return;
                mailboxPageByView[filterView] = Math.max(1, (mailboxPageByView[filterView] || 1) - 1);
                renderMailbox(latestSnapshot, activeView);
            });
        }

        if (mailboxNextBtn) {
            mailboxNextBtn.addEventListener('click', () => {
                const filterView = activeView === 'dashboard' || activeView === 'settings' ? 'inbox' : activeView;
                if (!isMailboxPaginatedView(filterView) || !latestSnapshot) return;
                const docs = latestSnapshot.docs.filter((doc) => isInView(doc, filterView));
                const totalPages = Math.max(1, Math.ceil(docs.length / MAILBOX_PAGE_SIZE));
                mailboxPageByView[filterView] = Math.min(totalPages, (mailboxPageByView[filterView] || 1) + 1);
                renderMailbox(latestSnapshot, activeView);
            });
        }

        window.addEventListener('resize', () => {
            if (!isMobileSidebarLayout()) closeSidebarMenu();
        });

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeMessageModal);
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeMessageModal);
        if (modalContent) {
            modalContent.addEventListener('click', async (event) => {
                const replyButton = event.target.closest('.modal-reply-btn');
                if (replyButton) {
                    const id = replyButton.getAttribute('data-reply-id');
                    if (!id) return;
                    const targetDoc = getDocFromSnapshot(id);
                    if (!targetDoc) return;
                    closeMessageModal();
                    openReplyModal(targetDoc);
                    return;
                }

                const statusSelect = event.target.closest('.modal-status');
                if (statusSelect) {
                    const id = statusSelect.getAttribute('data-id');
                    const status = statusSelect.value;
                    const db = window.InquiryService?.getDb();
                    if (db && id) {
                        db.collection('contactMessages').doc(id).update({
                            status,
                            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                    return;
                }

                const starBtn = event.target.closest('.star-toggle');
                if (starBtn) {
                    const id = starBtn.getAttribute('data-id');
                    const isStarred = starBtn.getAttribute('data-starred') === 'true';
                    const db = window.InquiryService?.getDb();
                    if (db && id) {
                        // Update visual state in the open message view immediately.
                        setStarButtonState(starBtn, !isStarred);
                        db.collection('contactMessages').doc(id).update({
                            starred: !isStarred,
                            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                    return;
                }

                const menuTrigger = event.target.closest('.row-menu-trigger');
                if (menuTrigger) {
                    const wrap = menuTrigger.closest('.row-menu-wrap');
                    const shouldOpen = !wrap.classList.contains('open');
                    closeAllRowMenus();
                    wrap.classList.toggle('open', shouldOpen);
                    if (shouldOpen && shouldRaiseMenu(wrap)) {
                        wrap.style.zIndex = String(menuZIndexCounter++);
                        const row = wrap.closest('.inquiry-item');
                        if (row) row.classList.add('menu-open');
                    }
                    return;
                }

                const actionBtn = event.target.closest('.row-action');
                if (actionBtn) {
                    const action = actionBtn.getAttribute('data-action');
                    const id = actionBtn.getAttribute('data-id');
                    const db = window.InquiryService?.getDb();
                    if (!db || !id) return;
                    if (action === 'delete' || action === 'trash') {
                        db.collection('contactMessages').doc(id).update({
                            folder: 'trash',
                            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                        });
                        closeAllRowMenus();
                        closeMessageModal();
                        return;
                    }
                    if (action === 'recover') {
                        db.collection('contactMessages').doc(id).update({
                            folder: 'inbox',
                            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                        });
                        closeAllRowMenus();
                        closeMessageModal();
                        return;
                    }
                    if (action === 'full-delete') {
                        const ok = await showActionModal({
                            title: 'Delete Permanently?',
                            text: 'This inquiry will be deleted forever and cannot be undone.',
                            kind: 'warning',
                            showCancel: true,
                            confirmText: 'Delete Permanently',
                            cancelText: 'Cancel'
                        });
                        if (!ok) {
                            closeAllRowMenus();
                            return;
                        }
                        try {
                            await db.collection('contactMessages').doc(id).delete();
                            if (selectedDashboardInquiryId === id) selectedDashboardInquiryId = null;
                            closeAllRowMenus();
                            closeMessageModal();
                            await showActionModal({
                                title: 'Deleted',
                                text: 'The inquiry was permanently deleted.',
                                kind: 'success',
                                showCancel: false,
                                confirmText: 'OK'
                            });
                        } catch (error) {
                            const extraHelp = String(error?.message || '').includes('Missing or insufficient permissions')
                                ? ' This is a Firestore Security Rules issue. Allow delete for your admin user in Firebase Console -> Firestore Database -> Rules.'
                                : '';
                            await showActionModal({
                                title: 'Delete Failed',
                                text: `Failed to delete permanently: ${error.message}${extraHelp}`,
                                kind: 'error',
                                showCancel: false,
                                confirmText: 'OK'
                            });
                            closeAllRowMenus();
                        }
                        return;
                    }
                    if (action === 'archive' || action === 'inbox') {
                        db.collection('contactMessages').doc(id).update({
                            folder: action === 'archive' ? 'archive' : 'inbox',
                            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                        });
                        closeAllRowMenus();
                        closeMessageModal();
                        return;
                    }
                    if (action === 'unarchive') {
                        db.collection('contactMessages').doc(id).update({
                            folder: 'inbox',
                            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                        });
                        closeAllRowMenus();
                        closeMessageModal();
                        return;
                    }
                    if (action === 'mark-read' || action === 'mark-unread') {
                        db.collection('contactMessages').doc(id).update({
                            isRead: action === 'mark-read',
                            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                        });
                        closeAllRowMenus();
                        return;
                    }
                    if (action === 'mark-gmail-replied') {
                        const targetDoc = getDocFromSnapshot(id);
                        const runUpdate = () => db.collection('contactMessages').doc(id).update({
                            responded: true,
                            respondedVia: 'gmail',
                            respondedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
                            updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
                        });

                        if (targetDoc) {
                            ensureSentRecordForInquiry(db, targetDoc, {
                                respondedVia: 'gmail',
                                message: 'Replied via Gmail.'
                            })
                                .then(runUpdate)
                                .then(() => closeAllRowMenus())
                                .catch((error) => {
                                    showActionModal({
                                        title: 'Update Failed',
                                        text: `Failed to mark Gmail reply: ${error.message}`,
                                        kind: 'error',
                                        showCancel: false,
                                        confirmText: 'OK'
                                    });
                                    closeAllRowMenus();
                                });
                            return;
                        }

                        runUpdate();
                        closeAllRowMenus();
                        return;
                    }
                    return;
                }
            });
            modalContent.addEventListener('submit', async (event) => {
                const inlineForm = event.target.closest('.inline-reply-form');
                if (!inlineForm) return;
                event.preventDefault();

                const targetId = inlineForm.getAttribute('data-reply-id') || '';
                const toEmail = (inlineForm.querySelector('.inline-reply-to')?.value || '').trim();
                const subject = (inlineForm.querySelector('.inline-reply-subject')?.value || '').trim();
                const message = (inlineForm.querySelector('.inline-reply-message')?.value || '').trim();
                const statusNode = inlineForm.querySelector('.inline-reply-status');
                const db = window.InquiryService?.getDb();
                if (!db || !targetId || !toEmail || !subject || !message) return;

                try {
                    await sendReplyAndPersist(db, { targetId, toEmail, subject, message }, statusNode, closeMessageModal);
                } catch (error) {
                    if (statusNode) statusNode.textContent = `Failed to send reply email: ${error.message}`;
                }
            });
        }
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !replyModal.classList.contains('hidden')) {
                closeReplyModal();
                return;
            }
            if (event.key === 'Escape' && !messageModal.classList.contains('hidden')) {
                closeMessageModal();
                return;
            }
            if (event.key === 'Escape' && adminShell?.classList.contains('sidebar-open')) {
                closeSidebarMenu();
            }
        });
    }

    async function reauthenticateUser(user, password) {
        const credential = window.firebase.auth.EmailAuthProvider.credential(user.email, password);
        await user.reauthenticateWithCredential(credential);
    }

    function bindAccountSettings(auth) {
        if (settingsBound) return;
        settingsBound = true;

		// Cute tabs: build tab UI dynamically in settings view
		try {
			const settingsViewNode = document.getElementById('settingsView');
			const emailForm = document.getElementById('updateEmailForm');
			const passwordForm = document.getElementById('updatePasswordForm');
			if (settingsViewNode && emailForm && passwordForm && !settingsTabsBound) {
				settingsTabsBound = true;
				const panel = document.createElement('section');
				panel.className = 'settings-panel';

				const heading = document.createElement('h2');
				heading.className = 'calligraphy';
				heading.textContent = 'Settings';

				const tabs = document.createElement('div');
				tabs.className = 'settings-tabs';

				const list = document.createElement('div');
				list.className = 'tab-list';
				const tabAccount = document.createElement('button');
				tabAccount.type = 'button';
				tabAccount.className = 'tab-btn active';
				tabAccount.setAttribute('data-tab', 'account');
				tabAccount.innerHTML = '<i class="fa-solid fa-user-gear"></i> Account';
				const tabSecurity = document.createElement('button');
				tabSecurity.type = 'button';
				tabSecurity.className = 'tab-btn';
				tabSecurity.setAttribute('data-tab', 'security');
				tabSecurity.innerHTML = '<i class="fa-solid fa-lock"></i> Security';
				const tabCustomization = document.createElement('button');
				tabCustomization.type = 'button';
				tabCustomization.className = 'tab-btn';
				tabCustomization.setAttribute('data-tab', 'customization');
				tabCustomization.innerHTML = '<i class="fa-solid fa-palette"></i> Customization';
				list.appendChild(tabAccount);
				list.appendChild(tabSecurity);
				list.appendChild(tabCustomization);

				const panels = document.createElement('div');
				panels.className = 'tab-panels';
				const panelAccount = document.createElement('div');
				panelAccount.className = 'tab-panel active';
				panelAccount.setAttribute('data-panel', 'account');
				const panelSecurity = document.createElement('div');
				panelSecurity.className = 'tab-panel';
				panelSecurity.setAttribute('data-panel', 'security');
				const panelCustomization = document.createElement('div');
				panelCustomization.className = 'tab-panel';
				panelCustomization.setAttribute('data-panel', 'customization');

				panelAccount.appendChild(emailForm);
				panelSecurity.appendChild(passwordForm);
				// Build customization content
				const currentPalette = localStorage.getItem('adminPalette') || 'purple';
				const currentTheme = (document.documentElement.getAttribute('data-theme') || localStorage.getItem('adminTheme') || 'light');
				const customizationWrap = document.createElement('div');
				customizationWrap.className = 'stack settings-form';
				customizationWrap.innerHTML = `
					<h3>Theme & Colors</h3>
					<div class="stack">
						<label class="muted">Palette</label>
						<div class="palette-grid" role="group" aria-label="Palette selection">
							<button type="button" class="palette-btn" data-palette="purple" aria-pressed="${currentPalette==='purple'}">
								<span class="swatch" data-color="1"></span>
								<span class="swatch" data-color="3"></span>
								<span class="swatch" data-color="5"></span>
								<span class="label">Purple</span>
							</button>
							<button type="button" class="palette-btn" data-palette="pink" aria-pressed="${currentPalette==='pink'}">
								<span class="swatch" data-color="1"></span>
								<span class="swatch" data-color="3"></span>
								<span class="swatch" data-color="5"></span>
								<span class="label">Pink</span>
							</button>
							<button type="button" class="palette-btn" data-palette="blue" aria-pressed="${currentPalette==='blue'}">
								<span class="swatch" data-color="1"></span>
								<span class="swatch" data-color="3"></span>
								<span class="swatch" data-color="5"></span>
								<span class="label">Blue</span>
							</button>
							<button type="button" class="palette-btn" data-palette="coffee" aria-pressed="${currentPalette==='coffee'}">
								<span class="swatch" data-color="1"></span>
								<span class="swatch" data-color="3"></span>
								<span class="swatch" data-color="5"></span>
								<span class="label">Coffee</span>
							</button>
							<button type="button" class="palette-btn" data-palette="pastel" aria-pressed="${currentPalette==='pastel'}">
								<span class="swatch" data-color="1"></span>
								<span class="swatch" data-color="3"></span>
								<span class="swatch" data-color="5"></span>
								<span class="label">Pastel</span>
							</button>
						</div>
					</div>
					<div class="stack">
						<label class="muted">Mode</label>
						<div class="mode-row" role="radiogroup" aria-label="Theme mode">
							<label class="mode-pill">
								<input type="radio" name="admin-mode" value="light" ${currentTheme==='light'?'checked':''}>
								<span><i class="fa-regular fa-sun"></i> Light</span>
							</label>
							<label class="mode-pill">
								<input type="radio" name="admin-mode" value="dark" ${currentTheme==='dark'?'checked':''}>
								<span><i class="fa-solid fa-moon"></i> Dark</span>
							</label>
						</div>
						<p class="small muted">Your selection applies across the entire dashboard.</p>
					</div>
				`;
				panelCustomization.appendChild(customizationWrap);
				panels.appendChild(panelAccount);
				panels.appendChild(panelSecurity);
				panels.appendChild(panelCustomization);

				tabs.appendChild(list);
				tabs.appendChild(panels);
				panel.appendChild(heading);
				panel.appendChild(tabs);

				// Move a status message (if exists) below panels
				const msg = document.getElementById('settingsMessage');
				if (msg) {
					panel.appendChild(msg);
				}

				// Replace existing settings children with our panel
				settingsViewNode.innerHTML = '';
				settingsViewNode.appendChild(panel);

				// Bind customization interactions
				customizationWrap.addEventListener('click', (e) => {
					const btn = e.target.closest('.palette-btn');
					if (!btn) return;
					const pal = btn.getAttribute('data-palette') || 'purple';
					applyPalette(pal);
					customizationWrap.querySelectorAll('.palette-btn').forEach((b) => {
						b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
					});
				});
				customizationWrap.addEventListener('change', (e) => {
					const input = e.target.closest('input[name="admin-mode"]');
					if (!input) return;
					const next = input.value === 'dark' ? 'dark' : 'light';
					document.documentElement.setAttribute('data-theme', next);
					localStorage.setItem('adminTheme', next);
					updateThemeIcon(next);
				});

				// Tab switching
				list.addEventListener('click', (e) => {
					const btn = e.target.closest('.tab-btn');
					if (!btn) return;
					const target = btn.getAttribute('data-tab');
					Array.from(list.querySelectorAll('.tab-btn')).forEach((b) => b.classList.toggle('active', b === btn));
					Array.from(panels.querySelectorAll('.tab-panel')).forEach((p) => p.classList.toggle('active', p.getAttribute('data-panel') === target));
				});
			}
		} catch (e) {
			// Non-fatal; settings still works without tabs
		}

        updateEmailForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            settingsMessage.textContent = '';

            const user = auth.currentUser;
            if (!user) {
                settingsMessage.textContent = 'No authenticated admin session found.';
                return;
            }

            const currentPassword = document.getElementById('currentPasswordForEmail').value;
            const newEmail = document.getElementById('newAdminEmail').value.trim();

            try {
                await reauthenticateUser(user, currentPassword);
                await user.updateEmail(newEmail);
                currentAdminEmail.textContent = newEmail;
                updateEmailForm.reset();
                settingsMessage.textContent = 'Admin email updated successfully.';
            } catch (error) {
                settingsMessage.textContent = formatFirebaseAuthError(error, 'reauth');
            }
        });

        updatePasswordForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            settingsMessage.textContent = '';

            const user = auth.currentUser;
            if (!user) {
                settingsMessage.textContent = 'No authenticated admin session found.';
                return;
            }

            const currentPassword = document.getElementById('currentPasswordForPassword').value;
            const newPassword = document.getElementById('newAdminPassword').value;

            try {
                await reauthenticateUser(user, currentPassword);
                await user.updatePassword(newPassword);
                updatePasswordForm.reset();
                settingsMessage.textContent = 'Admin password updated successfully.';
            } catch (error) {
                settingsMessage.textContent = formatFirebaseAuthError(error, 'reauth');
            }
        });
    }

    function init() {
        applySavedTheme();
        ensureActionModalElements();
        installAlertInterceptor();

        const auth = getFirebaseAuth();
        const db = window.InquiryService?.getDb();

        if (!auth || !db) {
            authMessage.textContent = 'Firebase is not configured yet. Update src/scripts/inquiry-service.js first.';
            return;
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            authMessage.textContent = '';

            const email = document.getElementById('adminEmail').value.trim();
            const password = document.getElementById('adminPassword').value;

            try {
                await auth.signInWithEmailAndPassword(email, password);
            } catch (error) {
                authMessage.textContent = formatFirebaseAuthError(error, 'login');
            }
        });

        logoutBtn.addEventListener('click', async () => {
            await auth.signOut();
        });

        bindViewControls();
        setActiveView('dashboard');

        auth.onAuthStateChanged((user) => {
            if (user) {
                showDashboard();
                bindStatusUpdates(db);
                bindStarUpdates(db);
                bindRowActions(db);
                bindReplyActions(db);
                bindAccountSettings(auth);
                subscribeToInquiries(db);
                currentAdminEmail.textContent = user.email || '-';
                currentAdminUserEmail = user.email || '';
                setActiveView('dashboard');
            } else {
                showAuth();
                settingsMessage.textContent = '';
                currentAdminEmail.textContent = '-';
                currentAdminUserEmail = '';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
