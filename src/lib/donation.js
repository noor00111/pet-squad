export const progressTone = (percent) => {
    if (percent >= 75) return { bar: 'from-emerald-400 to-emerald-500', text: 'text-emerald-500' };
    if (percent >= 40) return { bar: 'from-primary to-primary/80', text: 'text-primary dark:text-colorSecondary' };
    return { bar: 'from-colorSecondary to-amber-400', text: 'text-colorSecondary' };
};

export const daysLeft = (lastDate) => {
    if (!lastDate) return null;
    const end = new Date(lastDate);
    if (Number.isNaN(end.getTime())) return null;
    return Math.max(0, Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24)));
};
