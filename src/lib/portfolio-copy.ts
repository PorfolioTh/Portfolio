export type Locale = "fr" | "en";

export type PortfolioCopy = {
    metadata: { title: string; description: string; socialDescription: string };
    navigation: { home: string; skills: string; experience: string; projects: string; education: string; contact: string };
    languageSelector: string;
    theme: { switchToLight: string; switchToDark: string; light: string; dark: string; drag: string };
    toast: { welcome: string; close: string };
    hero: { greeting: string; description: string; location: string; contact: string; download: string; role: string; portraitAlt: string };
    skills: { title: string; subtitle: string; categories: { title: string; items: string[] }[] };
    experience: { title: string; entries: { year: string; company: string; role: string; description: string }[] };
    projects: { title: string; viewProject: string; viewLiveProject: string };
    projectPage: {
        backToProjects: string;
        viewRepository: string;
        viewLiveProject: string;
        description: string;
        objectives: string;
        stack: string;
        features: string;
        details: string;
        noImage: string;
    };
    education: { title: string; entries: { degree: string; school: string; description: string; year: string }[] };
    contact: {
        title: string;
        subtitle: string;
        role: string;
        availability: string;
        professionalEmail: string;
        whatsapp: string;
        follow: string;
        form: { name: string; phone: string; email: string; subject: string; message: string; submit: string; sending: string; sent: string; saved: string; error: string };
    };
    footer: { about: string; aboutDescription: string; availability: string; networks: string; socialDescription: string; contact: string; location: string; copyright: string };
    socialLabels: string[];
    fallback: { notFoundTitle: string; notFoundDescription: string; goHome: string; errorTitle: string; errorDescription: string; retry: string };
};

export const portfolioCopy: Record<Locale, PortfolioCopy> = {
    fr: {
        metadata: {
            title: "RASOLOFOSON Théophile — Développeur logiciel",
            description: "Portfolio de RASOLOFOSON Théophile, développeur Vue, React et Node.js à Antsirabe.",
            socialDescription: "Applications modernes, rapides et scalables en Vue, React et Node.js.",
        },
        navigation: { home: "Accueil", skills: "Compétences", experience: "Expériences", projects: "Projets", education: "Éducation", contact: "Contact" },
        languageSelector: { currentFrench: "Langue sélectionnée : français", currentEnglish: "Langue sélectionnée : anglais", switchToEnglish: "Passer en anglais", switchToFrench: "Passer en français" },
        theme: { switchToLight: "Activer le mode clair", switchToDark: "Activer le mode sombre", light: "Mode clair", dark: "Mode sombre", drag: "Glisser pour déplacer" },
        toast: { welcome: "Bienvenue dans mon univers", close: "Fermer la notification" },
        hero: {
            greeting: "Bonjour, je suis",
            description: "Développeur logiciel spécialisé en Vue, React et Node.js. Je transforme des idées en applications modernes, rapides et scalables.",
            location: "Antsirabe, Madagascar",
            contact: "Me contacter",
            download: "Télécharger CV",
            role: "Développeur Full Stack",
            portraitAlt: "Portrait de RASOLOFOSON Théophile",
        },
        skills: {
            title: "Compétences techniques",
            subtitle: "Technologies et outils que j'utilise au quotidien",
            categories: [
                { title: "Frontend", items: ["React.js", "Vue.js", "Next.js", "JavaScript", "TypeScript", "HTML/CSS", "TailwindCSS", "SASS"] },
                { title: "Backend", items: ["Node.js", "PHP", "Django REST Framework", "Spring Boot"] },
                { title: "Base de données", items: ["MongoDB", "MySQL"] },
                { title: "Design", items: ["Figma"] },
                { title: "Méthodologies", items: ["2TUP", "Merise", "Agile / Scrum", "UML"] },
                { title: "Outils", items: ["Visual Paradigm", "VS Code", "Postman", "Git/GitHub/GitLab"] },
            ],
        },
        experience: {
            title: "Expériences professionnelles",
            entries: [
                { year: "2025", company: "Mahiratra Groupe", role: "Application intranet", description: "Développement d'une application intranet pour la gestion interne de l'entreprise." },
                { year: "2025", company: "Mahiratra Groupe", role: "Transformation digitale", description: "Développement d'une application de transport maritime pour la gestion des bateaux d'une entreprise." },
                { year: "2024", company: "Tranoweb", role: "Mdgformation", description: "Contribution au développement d'une plateforme de formation en ligne." },
                { year: "2023", company: "Faculté des Sciences", role: "Gestion d'emploi du temps", description: "Développement d'un système universitaire de gestion d'emploi du temps." },
                { year: "2022", company: "Fyhary Soft", role: "Gestion d'entrepôt", description: "Création d'une application de gestion de stock et d'entrepôt." },
            ],
        },
        projects: {
            title: "Projets et réalisations",
            viewProject: "Voir le projet",
            viewLiveProject: "Voir le projet en ligne",
        },
        projectPage: {
            backToProjects: "Retour aux projets",
            viewRepository: "Voir le dépôt GitHub",
            viewLiveProject: "Voir le projet en ligne",
            description: "Description",
            objectives: "Objectifs",
            stack: "Technologies",
            features: "Fonctionnalités principales",
            details: "Informations complémentaires",
            noImage: "Aucune image pour ce projet",
        },
        education: {
            title: "Éducation",
            entries: [
                { degree: "Master professionnel et ingénieur en informatique", school: "École Nationale de l'Informatique (ENI), Madagascar", description: "Spécialisation en génie logiciel et bases de données", year: "2025" },
                { degree: "Licence professionnelle en informatique", school: "École Nationale de l'Informatique (ENI), Madagascar", description: "Formation approfondie en développement logiciel", year: "2023" },
                { degree: "Baccalauréat", school: "Lycée Horace François, Antalaha, Madagascar", description: "Obtention du diplôme du baccalauréat", year: "2019" },
            ],
        },
        contact: {
            title: "Contact",
            subtitle: "Restons en contact",
            role: "Développeur logiciel",
            availability: "Disponible pour vos projets web, mobile et systèmes.",
            professionalEmail: "E-mail professionnel",
            whatsapp: "WhatsApp direct",
            follow: "Me suivre",
            form: {
                name: "Nom", phone: "Téléphone", email: "E-mail", subject: "Sujet", message: "Message",
                submit: "Envoyer le message", sending: "Envoi…", sent: "Merci ! Votre message a bien été envoyé.",
                saved: "Votre message est enregistré, mais l'e-mail de notification n'a pas pu être envoyé.",
                error: "Une erreur est survenue, veuillez réessayer.",
            },
        },
        footer: {
            about: "À propos",
            aboutDescription: "Passionné par le développement logiciel et la création d'interfaces modernes. J'aime transformer des idées en produits concrets et utiles.",
            availability: "Disponible pour des missions freelance et des collaborations.",
            networks: "Réseaux sociaux",
            socialDescription: "Suivez mes projets et actualités",
            contact: "Contact",
            location: "Antsirabe, Madagascar",
            copyright: "© 2023 RASOLOFOSON Théophile",
        },
        socialLabels: ["Facebook", "Instagram", "WhatsApp", "GitHub"],
        fallback: {
            notFoundTitle: "Page introuvable",
            notFoundDescription: "La page recherchée n'existe pas ou a été déplacée.",
            goHome: "Retour à l'accueil",
            errorTitle: "Cette page n'a pas pu s'afficher",
            errorDescription: "Une erreur est survenue. Réessayez ou retournez à l'accueil.",
            retry: "Réessayer",
        },
    },
    en: {
        metadata: {
            title: "RASOLOFOSON Théophile — Software Developer",
            description: "Portfolio of RASOLOFOSON Théophile, a Vue, React, and Node.js developer based in Antsirabe.",
            socialDescription: "Modern, fast, and scalable applications with Vue, React, and Node.js.",
        },
        navigation: { home: "Home", skills: "Skills", experience: "Experience", projects: "Projects", education: "Education", contact: "Contact" },
        languageSelector: { currentFrench: "Selected language: French", currentEnglish: "Selected language: English", switchToEnglish: "Switch to English", switchToFrench: "Switch to French" },
        theme: { switchToLight: "Switch to light mode", switchToDark: "Switch to dark mode", light: "Light mode", dark: "Dark mode", drag: "Drag to move" },
        toast: { welcome: "Welcome to my world", close: "Close notification" },
        hero: {
            greeting: "Hello, I'm",
            description: "A software developer specializing in Vue, React, and Node.js. I turn ideas into modern, fast, and scalable applications.",
            location: "Antsirabe, Madagascar",
            contact: "Contact me",
            download: "Download CV",
            role: "Full-Stack Developer",
            portraitAlt: "Portrait of RASOLOFOSON Théophile",
        },
        skills: {
            title: "Technical skills",
            subtitle: "Technologies and tools I use every day",
            categories: [
                { title: "Frontend", items: ["React.js", "Vue.js", "Next.js", "JavaScript", "TypeScript", "HTML/CSS", "TailwindCSS", "SASS"] },
                { title: "Backend", items: ["Node.js", "PHP", "Django REST Framework", "Spring Boot"] },
                { title: "Databases", items: ["MongoDB", "MySQL"] },
                { title: "Design", items: ["Figma"] },
                { title: "Methodologies", items: ["2TUP", "Merise", "Agile / Scrum", "UML"] },
                { title: "Tools", items: ["Visual Paradigm", "VS Code", "Postman", "Git/GitHub/GitLab"] },
            ],
        },
        experience: {
            title: "Professional experience",
            entries: [
                { year: "2025", company: "Mahiratra Groupe", role: "Intranet application", description: "Developed an intranet application for the company's internal operations." },
                { year: "2025", company: "Mahiratra Groupe", role: "Digital transformation", description: "Developed a maritime transport application to manage a company's vessels." },
                { year: "2024", company: "Tranoweb", role: "Mdgformation", description: "Contributed to the development of an online learning platform." },
                { year: "2023", company: "Faculty of Sciences", role: "Timetable management", description: "Developed a university timetable management system." },
                { year: "2022", company: "Fyhary Soft", role: "Warehouse management", description: "Created an inventory and warehouse management application." },
            ],
        },
        projects: {
            title: "Projects and work",
            viewProject: "View project",
            viewLiveProject: "View live project",
        },
        projectPage: {
            backToProjects: "Back to projects",
            viewRepository: "View GitHub repository",
            viewLiveProject: "View live project",
            description: "Description",
            objectives: "Objectives",
            stack: "Technologies",
            features: "Key features",
            details: "Additional information",
            noImage: "No image for this project",
        },
        education: {
            title: "Education",
            entries: [
                { degree: "Professional master's degree and engineering degree in computer science", school: "National School of Informatics (ENI), Madagascar", description: "Specialized in software engineering and databases", year: "2025" },
                { degree: "Professional bachelor's degree in computer science", school: "National School of Informatics (ENI), Madagascar", description: "Advanced training in software development", year: "2023" },
                { degree: "High school diploma", school: "Lycée Horace François, Antalaha, Madagascar", description: "High school graduation", year: "2019" },
            ],
        },
        contact: {
            title: "Contact",
            subtitle: "Let's stay in touch",
            role: "Software developer",
            availability: "Available for web, mobile, and systems projects.",
            professionalEmail: "Professional email",
            whatsapp: "Direct WhatsApp",
            follow: "Follow me",
            form: {
                name: "Name", phone: "Phone", email: "Email", subject: "Subject", message: "Message",
                submit: "Send message", sending: "Sending…", sent: "Thank you! Your message has been sent.",
                saved: "Your message was saved, but the notification email could not be sent.",
                error: "Something went wrong. Please try again.",
            },
        },
        footer: {
            about: "About",
            aboutDescription: "Passionate about software development and creating modern interfaces. I enjoy turning ideas into useful, tangible products.",
            availability: "Available for freelance work and collaborations.",
            networks: "Social networks",
            socialDescription: "Follow my projects and updates",
            contact: "Contact",
            location: "Antsirabe, Madagascar",
            copyright: "© 2023 RASOLOFOSON Théophile",
        },
        socialLabels: ["Facebook", "Instagram", "WhatsApp", "GitHub"],
        fallback: {
            notFoundTitle: "Page not found",
            notFoundDescription: "The page you're looking for doesn't exist or has been moved.",
            goHome: "Back to home",
            errorTitle: "This page couldn't be loaded",
            errorDescription: "Something went wrong. Please try again or go back home.",
            retry: "Try again",
        },
    },
};
