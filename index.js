import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async function() {
    const waitForFirebase = () => {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (window.firebaseAuth) {
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    };

    try {
        await waitForFirebase();
        const auth = window.firebaseAuth;

        onAuthStateChanged(auth, (user) => {
            const signinButton = document.querySelector('.desktop-signin .signin-button');
            const profileContainer = document.querySelector('.desktop-signin .profile-container');
            const mobileSignin = document.querySelector('.mobile-signin');
            const menuIcon = document.querySelector('.menu-icon');
            const mobMenuPic = document.querySelector('.mob-menu-pic');
            const mobProfileSection = document.querySelector('.mob-profile-section');
            
            if (user) {
                // User is signed in
                if (signinButton) signinButton.style.display = 'none';
                if (profileContainer) {
                    profileContainer.style.display = 'flex';
                    
                    // Update profile images and info
                    const profileImage = profileContainer.querySelector('.profile-image');
                    const profileName = profileContainer.querySelector('.profile-name');
                    const dropdownProfileImage = profileContainer.querySelector('.dropdown-profile-image');
                    const dropdownName = profileContainer.querySelector('.dropdown-name');
                    const dropdownEmail = profileContainer.querySelector('.dropdown-email');

                    if (user.photoURL) {
                        if (profileImage) profileImage.src = user.photoURL;
                        if (dropdownProfileImage) dropdownProfileImage.src = user.photoURL;
                        if (mobMenuPic) {
                            mobMenuPic.src = user.photoURL;
                            mobMenuPic.style.display = 'block';
                        }
                    }

                    if (user.displayName) {
                        if (profileName) profileName.textContent = user.displayName;
                        if (dropdownName) dropdownName.textContent = user.displayName;
                    }

                    if (user.email && dropdownEmail) {
                        dropdownEmail.textContent = user.email;
                    }

                    // Setup mobile menu
                    if (menuIcon) menuIcon.classList.add('show-profile');
                    if (mobProfileSection) {
                        mobProfileSection.style.display = 'block';
                        const mobDp = mobProfileSection.querySelector('.mob-dp');
                        const mobName = mobProfileSection.querySelector('.mob-name');
                        const mobEmail = mobProfileSection.querySelector('.mob-email');
                        
                        if (mobDp && user.photoURL) mobDp.src = user.photoURL;
                        if (mobName && user.displayName) mobName.textContent = user.displayName;
                        if (mobEmail && user.email) mobEmail.textContent = user.email;
                    }
                }
                if (mobileSignin) mobileSignin.style.display = 'none';
            } else {
                // User is signed out
                if (signinButton) signinButton.style.display = 'block';
                if (profileContainer) profileContainer.style.display = 'none';
                if (mobileSignin) mobileSignin.style.display = 'block';
                if (menuIcon) menuIcon.classList.remove('show-profile');
                if (mobProfileSection) mobProfileSection.style.display = 'none';
                if (mobMenuPic) mobMenuPic.style.display = 'none';
            }
        });

        // Handle sign out
        const signOutButtons = document.querySelectorAll('.sign-out-btn, .mob-signout');
        signOutButtons.forEach(btn => {
            btn?.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await signOut(auth);
                    window.location.href = 'auth.html';
                } catch (error) {
                    console.error('Error signing out:', error);
                }
            });
        });

    } catch (error) {
        console.error('Error:', error);
    }
}); 