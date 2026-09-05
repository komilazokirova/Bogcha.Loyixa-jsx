export const mockStaff = [
    { id: 1, firstName: "Nodira", lastName: "Sharipova", position: "Tarbiyachi", group: "Yasli", phone: "+998901112233", status: "faol" },
    { id: 2, firstName: "Gulnora", lastName: "Tosheva", position: "Tarbiyachi", group: "Kichik", phone: "+998901112244", status: "faol" },
    { id: 3, firstName: "Malika", lastName: "Rustamova", position: "Tarbiyachi", group: "O'rta", phone: "+998901112255", status: "faol" },
    { id: 4, firstName: "Feruza", lastName: "Ahmedova", position: "Tarbiyachi", group: "Katta", phone: "+998901112266", status: "faol" },
    { id: 5, firstName: "Aziz", lastName: "Norqulov", position: "Oshpaz", group: "-", phone: "+998901112277", status: "faol" },
    { id: 6, firstName: "Shahnoza", lastName: "Yusupova", position: "Hamshira", group: "-", phone: "+998901112288", status: "ta'tilda" },
];

export const positionOptions = [
    "Tarbiyachi",
    "Bosh tarbiyachi",
    "Mudira",
    "Oshpaz",
    "Hamshira",
    "Farrosh",
    "Qorovul",
];

export const staffGroupOptions = ["-", "Yasli", "Kichik", "O'rta", "Katta"];

export const staffStatusOptions = ["faol", "ta'tilda", "ishdan bo'shagan"];

export const positionConfig = {
    "Tarbiyachi":      { chip: "bg-sky/15 text-sky",               avatar: "from-sky to-cyan-400" },
    "Bosh tarbiyachi": { chip: "bg-bubblegum/15 text-bubblegum",   avatar: "from-bubblegum to-pink-400" },
    "Mudira":          { chip: "bg-violet-500/15 text-violet-600", avatar: "from-violet-500 to-fuchsia-400" },
    "Oshpaz":          { chip: "bg-sun/15 text-amber-600",         avatar: "from-sun to-amber-400" },
    "Hamshira":        { chip: "bg-grass/15 text-emerald-700",     avatar: "from-grass to-emerald-400" },
    "Farrosh":         { chip: "bg-slate-400/15 text-slate-600",   avatar: "from-slate-400 to-slate-500" },
    "Qorovul":         { chip: "bg-indigo-500/15 text-indigo-600", avatar: "from-indigo-500 to-blue-400" },
};

export const staffStatusConfig = {
    "faol":             { label: "Faol",             dot: "bg-grass",   chip: "bg-grass/15 text-emerald-700" },
    "ta'tilda":         { label: "Ta'tilda",         dot: "bg-sun",     chip: "bg-sun/15 text-amber-600" },
    "ishdan bo'shagan": { label: "Ishdan bo'shagan", dot: "bg-red-500", chip: "bg-red-500/15 text-red-600" },
};

export const staffStatusColors = {
    "faol": "default",
    "ta'tilda": "secondary",
    "ishdan bo'shagan": "destructive",
};