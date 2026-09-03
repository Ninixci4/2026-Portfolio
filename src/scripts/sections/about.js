(function () {
    const STACK_ROWS = [
        [
            { name: 'HTML', icon: 'devicon-html5-plain colored' },
            { name: 'CSS', icon: 'devicon-css3-plain colored' },
            { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
            { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
            { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-original colored' },
            { name: 'Bootstrap 5', icon: 'devicon-bootstrap-plain colored' },
            { name: 'jQuery', icon: 'devicon-jquery-plain colored' },
            { name: 'PHP', icon: 'devicon-php-plain colored' },
            { name: 'Python', icon: 'devicon-python-plain colored' },
            { name: 'Java', icon: 'devicon-java-plain colored' },
            { name: 'C++', icon: 'devicon-cplusplus-plain colored' },
            { name: 'VB.NET', icon: 'devicon-dot-net-plain colored' },
            { name: 'React', icon: 'devicon-react-original colored' },
            { name: 'Next.js', icon: 'devicon-nextjs-original is-mono' },
            { name: 'Flutter', icon: 'devicon-flutter-plain colored' }
        ],
        [
            { name: 'MySQL', icon: 'devicon-mysql-original colored' },
            { name: 'Supabase', icon: 'devicon-supabase-original colored' },
            { name: 'Firebase', icon: 'devicon-firebase-plain colored' },
            { name: 'PHPMailer', fa: 'fas fa-envelope', color: '#BA0C2F' },
            { name: 'Git', icon: 'devicon-git-plain colored' },
            { name: 'GitHub', icon: 'devicon-github-original is-mono' },
            { name: 'Vercel', icon: 'devicon-vercel-original is-mono' },
            { name: 'XAMPP', fa: 'fas fa-server', color: '#FB7A24' },
            { name: 'VS Code', icon: 'devicon-vscode-plain colored' },
            { name: 'Android Studio', icon: 'devicon-androidstudio-plain colored' },
            { name: 'Figma', icon: 'devicon-figma-plain colored' },
            { name: 'Canva', icon: 'devicon-canva-original colored' },
            { name: 'Photoshop', icon: 'devicon-photoshop-plain colored' },
            { name: 'Blender', icon: 'devicon-blender-original colored' }
        ]
    ];

    function chipHTML(item) {
        const mark = item.fa
            ? `<i class="${item.fa}" style="color:${item.color}" aria-hidden="true"></i>`
            : `<i class="${item.icon}" aria-hidden="true"></i>`;
        return `<span class="stack-chip">${mark}<span>${item.name}</span></span>`;
    }

    function fillMarquee(marquee, items) {
        const seed = items.map(chipHTML).join('');
        marquee.innerHTML = `
            <div class="stack-track">
                <div class="stack-group">${seed}</div>
                <div class="stack-group">${seed}</div>
            </div>
        `;

        const groups = [...marquee.querySelectorAll('.stack-group')];

        function grow() {
            const minWidth = Math.max(marquee.clientWidth, 768);
            groups.forEach((group) => {
                group.innerHTML = seed;
                const base = [...group.children];
                let guard = 0;
                while (group.scrollWidth < minWidth && guard < 12) {
                    base.forEach((node) => group.appendChild(node.cloneNode(true)));
                    guard += 1;
                }
            });
        }

        grow();
        window.addEventListener('resize', grow);
    }

    function bootAbout() {
        document.querySelectorAll('[data-stack-row]').forEach((marquee) => {
            const row = Number(marquee.dataset.stackRow);
            const items = STACK_ROWS[row];
            if (items) fillMarquee(marquee, items);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootAbout);
    } else {
        bootAbout();
    }
})();
