/* ============================================================
   cards-data.js — Add new calculators here ONLY.
   Each object = one card on the homepage.

   icon      : Iconify icon name
               Browse icons at https://icon-sets.iconify.design
               Recommended sets: tabler, ph, mdi
   iconBg    : background color of the icon box
   iconColor : icon SVG color
   badge     : small label shown on card
   link      : path to the calculator HTML file
   ============================================================ */

const CALCULATORS = [
    {
        title: "Prime or Composite?",
        description: "Find out if a number is prime or composite. Also shows all its factors.",
        icon: "tabler:math-pi",
        iconBg: "#EDE0F5",
        iconColor: "#6E3482",
        badge: "Numbers",
        link: "calculators/prime-composite.html",
    },
    {
        title: "LCM & HCF",
        description: "Calculate the Lowest Common Multiple and Highest Common Factor of two or three numbers.",
        icon: "tabler:arrows-join",
        iconBg: "#DDE8FB",
        iconColor: "#3456A4",
        badge: "Numbers",
        link: "calculators/lcm-hcf.html",
    },
    {
        title: "Fraction Simplifier",
        description: "Enter numerator and denominator — get the fraction in its simplest form.",
        icon: "tabler:divide",
        iconBg: "#FDE8D8",
        iconColor: "#C4601A",
        badge: "Fractions",
        link: "calculators/fractions.html",
    },
    {
        title: "Percentage Finder",
        description: "Find what percent X is of Y, or calculate X% of any number instantly.",
        icon: "tabler:percent",
        iconBg: "#D8F5E8",
        iconColor: "#1A8A4A",
        badge: "Percentage",
        link: "calculators/percentage.html",
    },
    {
        title: "Factors & Multiples",
        description: "List all factors of a number, or generate the first N multiples of any number.",
        icon: "tabler:multiplication",
        iconBg: "#FDF0D8",
        iconColor: "#B07010",
        badge: "Numbers",
        link: "calculators/factors-multiples.html",
    },
    {
        title: "Even or Odd?",
        description: "Check whether a number is even or odd. Great for quick practice!",
        icon: "tabler:replace",
        iconBg: "#F0D8F5",
        iconColor: "#8A2BA0",
        badge: "Numbers",
        link: "calculators/even-odd.html",
    },
    {
        title: "Coprime Checker",
        description: "Check if two numbers are coprime (share no common factors other than 1).",
        icon: "tabler:brand-codesandbox",
        iconBg: "#E8D8F0",
        iconColor: "#6E3482",
        badge: "Numbers",
        link: "calculators/coprime.html",
    },
    {
        title: "BODMAS Calculator",
        description: "Solve expressions with brackets, decimals, and all operators. Follows BODMAS/PEMDAS rule.",
        icon: "tabler:math-function",
        iconBg: "#E0E8F5",
        iconColor: "#3456A4",
        badge: "Algebra",
        link: "calculators/bodmas.html",
    },

    {
        title: "Profit & Loss",
        description: "Calculate profit, loss, CP, SP, and percentages with step-by-step explanations.",
        icon: "tabler:chart-line",
        iconBg: "#E8F5E8",
        iconColor: "#1A8A4A",
        badge: "Business Math",
        link: "calculators/profit-loss.html",
    },

    // ── ADD MORE CALCULATORS BELOW THIS LINE ─────────────────
    // {
    //   title:      "Square Root",
    //   description:"Find the square root of any number.",
    //   icon:       "tabler:square-root",
    //   iconBg:     "#D8EEF5",
    //   iconColor:  "#1A6A8A",
    //   badge:      "Numbers",
    //   link:       "calculators/square-root.html",
    // },
];