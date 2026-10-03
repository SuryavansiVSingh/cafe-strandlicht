// All website text in Dutch (nl) and English (en).
// To add a language: copy the "en" block, translate it, add a button in index.html.
window.I18N = {
  nl: {
    skip: "Naar inhoud",
    "nav.menu": "Menu", "nav.about": "Over ons", "nav.visit": "Bezoek", "nav.reserve": "Reserveren",
    "hero.eyebrow": "Blankenberge · Zeedijk",
    "hero.title": "Koffie met zicht op zee",
    "hero.lead": "Ontbijt, lunch, wafels en ambachtelijk ijs — elke dag vers, met je voeten bijna in het zand.",
    "hero.cta": "Tafel reserveren", "hero.cta2": "Bekijk het menu",
    marquee: "Koffie · Ontbijt · Lunch · Wafels · IJs · Zonsondergang · ",
    "menu.eyebrow": "Onze kaart", "menu.title": "Eenvoudig, vers en lokaal",
    "menu.tab.coffee": "Koffie & drank", "menu.tab.breakfast": "Ontbijt", "menu.tab.lunch": "Lunch", "menu.tab.sweet": "Wafels & ijs",
    "about.eyebrow": "Ons verhaal", "about.title": "Een klein café met een groot terras",
    "about.p1": "Strandlicht begon met één espressomachine en een paar strandstoelen. Vandaag zetten we nog steeds elke kop met dezelfde zorg — met bonen van een kleine Belgische brander.",
    "about.p2": "We bakken onze wafels zelf, halen garnalen bij de vissers van de kust en draaien ons ijs elke ochtend vers.",
    "about.s1": "dagen per week open in de zomer", "about.s2": "plaatsen op het terras", "about.s3": "smaken huisgemaakt ijs",
    "visit.eyebrow": "Bezoek ons", "visit.title": "Openingsuren & ligging", "visit.hours": "Openingsuren", "visit.where": "Waar",
    "visit.note": "Juli & augustus: elke dag open.",
    "visit.transport": "5 min wandelen van station Blankenberge · kusttram halte Casino.",
    "day.mon": "Maandag", "day.tue": "Dinsdag", "day.wed": "Woensdag", "day.thu": "Donderdag", "day.fri": "Vrijdag", "day.sat": "Zaterdag", "day.sun": "Zondag",
    closed: "Gesloten", "open.now": "Nu open", "open.closed": "Nu gesloten",
    "demo.addr": "demo-adres",
    "contact.eyebrow": "Reserveren", "contact.title": "Hou een tafel voor ons vrij",
    "contact.lead": "Voor groepen vanaf 6 personen raden we reserveren aan. We antwoorden binnen 24 uur.",
    "f.name": "Naam", "f.email": "E-mail", "f.date": "Datum", "f.guests": "Aantal personen", "f.message": "Bericht (optioneel)", "f.send": "Verstuur",
    "err.name": "Vul je naam in (minstens 2 tekens).",
    "err.email": "Vul een geldig e-mailadres in.",
    "err.date": "Kies een datum vanaf vandaag.",
    "err.guests": "Kies tussen 1 en 20 personen.",
    "f.sending": "Bezig met versturen…",
    "f.ok": "Bedankt! We antwoorden binnen 24 uur.",
    "f.demo": "Bedankt! (Demo-modus: er is niets verstuurd.)",
    "f.fail": "Versturen mislukt. Probeer opnieuw of bel ons.",
    "footer.demo": "Demo-website — fictieve zaak, gemaakt als portfolioproject.",
    "footer.top": "Terug naar boven ↑"
  },
  en: {
    skip: "Skip to content",
    "nav.menu": "Menu", "nav.about": "About", "nav.visit": "Visit", "nav.reserve": "Book a table",
    "hero.eyebrow": "Blankenberge · Seafront",
    "hero.title": "Coffee with a sea view",
    "hero.lead": "Breakfast, lunch, waffles and artisan ice cream — fresh every day, with your toes almost in the sand.",
    "hero.cta": "Book a table", "hero.cta2": "See the menu",
    marquee: "Coffee · Breakfast · Lunch · Waffles · Ice cream · Sunset · ",
    "menu.eyebrow": "Our menu", "menu.title": "Simple, fresh and local",
    "menu.tab.coffee": "Coffee & drinks", "menu.tab.breakfast": "Breakfast", "menu.tab.lunch": "Lunch", "menu.tab.sweet": "Waffles & ice cream",
    "about.eyebrow": "Our story", "about.title": "A small café with a big terrace",
    "about.p1": "Strandlicht started with one espresso machine and a few deck chairs. Today we still make every cup with the same care — using beans from a small Belgian roaster.",
    "about.p2": "We bake our own waffles, buy shrimp from the coast's fishermen and churn our ice cream fresh every morning.",
    "about.s1": "days a week open in summer", "about.s2": "seats on the terrace", "about.s3": "homemade ice cream flavours",
    "visit.eyebrow": "Visit us", "visit.title": "Opening hours & location", "visit.hours": "Opening hours", "visit.where": "Where",
    "visit.note": "July & August: open every day.",
    "visit.transport": "5 min walk from Blankenberge station · coast tram stop Casino.",
    "day.mon": "Monday", "day.tue": "Tuesday", "day.wed": "Wednesday", "day.thu": "Thursday", "day.fri": "Friday", "day.sat": "Saturday", "day.sun": "Sunday",
    closed: "Closed", "open.now": "Open now", "open.closed": "Closed now",
    "demo.addr": "demo address",
    "contact.eyebrow": "Reservations", "contact.title": "Save us a table",
    "contact.lead": "We recommend booking for groups of 6 or more. We reply within 24 hours.",
    "f.name": "Name", "f.email": "Email", "f.date": "Date", "f.guests": "Number of guests", "f.message": "Message (optional)", "f.send": "Send",
    "err.name": "Enter your name (at least 2 characters).",
    "err.email": "Enter a valid email address.",
    "err.date": "Pick a date from today onwards.",
    "err.guests": "Choose between 1 and 20 guests.",
    "f.sending": "Sending…",
    "f.ok": "Thank you! We'll reply within 24 hours.",
    "f.demo": "Thank you! (Demo mode: nothing was sent.)",
    "f.fail": "Sending failed. Please try again or call us.",
    "footer.demo": "Demo website — fictional business, built as a portfolio project.",
    "footer.top": "Back to top ↑"
  }
};

// Menu: [Dutch name, English name, Dutch description, English description, price in €]
window.MENU = {
  coffee: [
    ["Espresso", "Espresso", "Belgische branding, kort en krachtig", "Belgian roast, short and strong", 2.6],
    ["Cappuccino", "Cappuccino", "Met speculoosje", "With a speculoos biscuit", 3.6],
    ["Latte macchiato", "Latte macchiato", "Ook met haver- of sojamelk", "Also with oat or soy milk", 4.2],
    ["Warme chocolademelk", "Hot chocolate", "Belgische chocolade, slagroom", "Belgian chocolate, whipped cream", 4.5],
    ["Verse muntthee", "Fresh mint tea", "Met honing", "With honey", 3.8],
    ["Huisgemaakte limonade", "Homemade lemonade", "Citroen & gember", "Lemon & ginger", 4.5]
  ],
  breakfast: [
    ["Strandontbijt", "Beach breakfast", "Croissant, brood, confituur, gekookt ei, verse jus", "Croissant, bread, jam, boiled egg, fresh juice", 14.5],
    ["Yoghurt bowl", "Yoghurt bowl", "Granola, rood fruit, honing", "Granola, red berries, honey", 8.5],
    ["Croissant & koffie", "Croissant & coffee", "Klein ontbijt aan de toog", "Quick breakfast at the bar", 5.9],
    ["Eggs Benedict", "Eggs Benedict", "Hollandaise, ham of zalm", "Hollandaise, ham or salmon", 13.0]
  ],
  lunch: [
    ["Croque monsieur", "Croque monsieur", "Ham & kaas, slaatje", "Ham & cheese, side salad", 11.5],
    ["Garnaalslaatje", "Grey shrimp salad", "Noordzeegarnalen, tomaat, cocktailsaus", "North Sea shrimp, tomato, cocktail sauce", 19.5],
    ["Tomaat-garnaal", "Tomato with shrimp", "De klassieker van de kust", "The coast classic", 18.0],
    ["Soep van de dag", "Soup of the day", "Met brood", "With bread", 6.5],
    ["Veggie wrap", "Veggie wrap", "Hummus, gegrilde groenten", "Hummus, grilled vegetables", 12.0]
  ],
  sweet: [
    ["Brusselse wafel", "Brussels waffle", "Poedersuiker", "Icing sugar", 5.5],
    ["Wafel met aardbeien", "Waffle with strawberries", "Slagroom & verse aardbeien", "Whipped cream & fresh strawberries", 8.9],
    ["Coupe Strandlicht", "Strandlicht sundae", "3 bollen, slagroom, rood fruit", "3 scoops, cream, red berries", 9.5],
    ["IJshoorntje", "Ice cream cone", "Per bol", "Per scoop", 2.5],
    ["Dame blanche", "Dame blanche", "Vanille-ijs, warme chocoladesaus", "Vanilla ice cream, hot chocolate sauce", 8.5]
  ]
};
