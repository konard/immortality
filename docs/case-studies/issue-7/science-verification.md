# Issue #7: verifying the science behind the immortality claims

Checked on 2026-10-22, for [konard/immortality issue #7](https://github.com/konard/immortality/issues/7) ("Double check correctness of all conclusions about immortality").

## Method and rules used

- **Evidence ranking.** Primary sources come first:
  - peer-reviewed papers with DOIs (checked against Crossref or Europe PMC wherever possible)
  - regulator notices (FDA, EMA, MHRA, NICE / NHS England)
  - ClinicalTrials.gov records, read through the v2 API (`https://clinicaltrials.gov/api/v2/studies/{NCT}`)
  - company filings with the US SEC (8-K exhibits)

  Trade press is used only when no primary source was reachable. In that case the source is labelled as secondary.
- **Consensus rule (from the issue).** A conclusion is called *likely* only when several independent groups, ideally in different countries, agree. A single paper with no independent replication is labelled **Unconfirmed-single-study**, however prestigious its venue.
- **Verdicts.**
  - **Confirmed:** correct as written.
  - **Corrected:** factually wrong, with a fix proposed.
  - **Outdated:** correct when written, but superseded by later events.
  - **Unconfirmed-single-study:** rests on one study or one group.
  - **Speculative:** a hypothesis with no empirical consensus.
- **What could not be verified is said explicitly.** It is also listed in the section "Items that could not be verified" at the end. No citation, DOI or date below was invented. Where a DOI was not confirmed through Crossref or Europe PMC, the reference says so.
- **DOI checks.** Every journal DOI in the reference list was resolved through the Crossref REST API (`api.crossref.org/works/{doi}`) on 2026-10-22. The returned title, first author, year, volume and pages matched the entries below. Earlier guessed DOIs that resolved to unrelated papers were discarded.
- **Dashboard numbers.** These were recomputed with a script that reimplements `rollingSlope` (10-year trailing OLS, `SMOOTH_WINDOW = 10`, `app/src/App.tsx:41`) and `assessLev` (30-year trend fit, `app/src/analytics.ts:102-129`). The script ran on the repository snapshot `app/public/data/life-expectancy.json`: OWID "Life expectancy at birth (period)", fetched 2026-08-10. The latest data year in that snapshot is **2023**.

---

## Claim 1: `CRISPR-Autologous-Gene-Therapy.md` (dated May 1, 2025)

### 1.1 Introduction: "corrected DNA template" and "infect"

> "By harvesting a patient’s own cells, delivering the editing machinery along with a “corrected” DNA template, and reinfusing the repaired cells, researchers can now **“infect”** humans with their own DNA to fix disease-causing mutations." (`CRISPR-Autologous-Gene-Therapy.md:10`)

**Verdict: Corrected.**

**Evidence**

- **Casgevy (exa-cel) uses no donor template.**
  - Patient CD34+ cells are electroporated with a Cas9–sgRNA ribonucleoprotein.
  - The Cas9 cut, repaired by error-prone NHEJ, disrupts a GATA1 binding site in the erythroid-specific enhancer of *BCL11A*.
  - Fetal haemoglobin (HbF) then rises. The disease-causing *HBB* mutation is not corrected [6, 7, 8].
- **EDIT-101 also uses no donor template.** Its two guides delete the intronic *CEP290* IVS26 variant [18].
- **NTLA-2001 / nex-z also uses no donor template.** It is an NHEJ knockout of *TTR* [20, 21].
- **None of the three marketed or late-stage examples in the document uses HDR with a donor template.**
- **"Infect" is a misnomer.**
  - Casgevy involves no virus at all.
  - The cells are the patient's own (autologous), edited outside the body, and returned after myeloablative busulfan conditioning.
- **Consensus.** The mechanism is described the same way by:
  - the pivotal trial reports (multinational: US, Canada, Europe, Middle East) [7, 8]
  - FDA [1], EMA [3] and MHRA [2]

  This is uncontested.

**Proposed wording**

> CRISPR–Cas9 and its derivative technologies (base editors, prime editors) have ushered in a new era of precision gene therapy. In the *ex vivo* approach, a patient’s own blood stem cells are collected, edited outside the body, and reinfused after chemotherapy conditioning. The first approved CRISPR medicine, Casgevy, does not insert a corrected gene. It uses a single Cas9 cut to switch off the *BCL11A* erythroid enhancer, so red cells make fetal haemoglobin again. *In vivo* approaches instead deliver the editor directly into the body (e.g. by lipid nanoparticles to the liver).

In the conclusion (line 108), replace "making “infecting” oneself …" with "making treatment with one’s own edited cells …".

### 1.2 Mechanism section (HDR, base and prime editing)

> "Cells repair this via non-homologous end joining (NHEJ) or homology-directed repair (HDR)" / "Base editors convert single bases (e.g. A→G or C→T) without double-strand breaks" / "Prime editors reverse-transcribe edits from an extended guide RNA, also avoiding classic breaks." (`CRISPR-Autologous-Gene-Therapy.md:16-25`)

**Verdict: Confirmed**, with one clarification.

**Evidence**

- The general mechanism text is textbook-correct.
- Prime editors nick one DNA strand rather than leaving the DNA uncut.
- In vivo base editing has now been used clinically:
  - the "baby KJ" CPS1-deficiency case: LNP-delivered adenine base editor, NEJM 2025, one patient [27, 28]
  - the first prime-editing human data: Prime Medicine PM359, ex vivo, p47phox chronic granulomatous disease, two patients, NEJM, December 2025 [29]

  Both are **Unconfirmed-single-study**: one or two patients each, no replication yet.

**Proposed wording (add after line 25)**

> Clinically, most approved or late-stage CRISPR therapies use NHEJ gene disruption rather than HDR correction. The first in-vivo base-editing treatment, a personalised editor for one infant with CPS1 deficiency, was reported in 2025 (Musunuru et al., NEJM). The first prime-editing patient data (two patients with p47phox chronic granulomatous disease) were also reported in 2025. Both are single-patient or two-patient reports, not yet replicated.

### 1.3 Delivery table

> "edit in culture (electroporation or viral vector)" (`:35`); "Direct infusion of vectors or nanoparticles carrying editors (± donor DNA)" (`:36`)

**Verdict: Confirmed** in general. For Casgevy specifically it should say *electroporation*: there is no viral vector [6].

The in-vivo row lists EDIT-101 under "infusion". EDIT-101 is actually a **subretinal injection** of AAV5 [18].

**Proposed wording**

- Ex vivo row: "edit in culture (for Casgevy: electroporation of Cas9–guide RNA complexes; some other products use viral vectors)".
- In vivo row: "Direct delivery of editors into the body, e.g. intravenous lipid nanoparticles (NTLA-2001) or subretinal AAV injection (EDIT-101)".

### 1.4 Casgevy mechanism and indications

> "CRISPR–Cas9 targets the BCL11A enhancer to reactivate fetal hemoglobin (HbF)." (`:47`); indications SCD with recurrent VOCs and transfusion-dependent β-thalassemia (`:44-46`)

**Verdict: Confirmed** [1, 3, 7, 8].

The age limits have changed (see 1.5).

### 1.5 Casgevy approvals and dates

> "**FDA approval:** December 8, 2023" (`:49`); "**MHRA (UK):** November 16, 2023; NHS rollout at specialist centers" (`:50`)

**Verdict: Confirmed (dates) / Outdated (scope).**

**Evidence**

| Event | Date | Source |
|---|---|---|
| MHRA conditional marketing authorisation, SCD and TDT, ages 12+ (world first) | 16 Nov 2023 | gov.uk [2] |
| FDA approval, SCD, ages 12+ (same day as bluebird's Lyfgenia, lovo-cel) | 8 Dec 2023 | FDA [1] |
| FDA approval, TDT, ages 12+ (ahead of the 30 Mar 2024 PDUFA date) | 16 Jan 2024 | [5] (secondary; the FDA notice was not separately retrieved) |
| EMA CHMP positive opinion | Dec 2023 | PEI [4] |
| EU conditional marketing authorisation | 9 Feb 2024 | EMA EPAR [3] |
| FDA label expanded to ages 2+ (SCD and TDT), based on CLIMB-151 / CLIMB-141; approved 53 days after filing, under a Commissioner's National Priority Voucher | announced 1 Jul 2026 | Vertex 8-K [11]; Healio [12] |
| Approved in 39 countries (North America, Europe, Middle East) | as of Q2 2026 | Vertex 8-K [11] |

**Consensus.** Regulatory facts are primary-source facts; no replication is needed.

**Proposed wording (replace lines 49-50)**

> - **MHRA (UK):** conditional authorisation 16 November 2023 (world first; ages 12+)
> - **FDA (US):** SCD approved 8 December 2023 (same day as bluebird bio’s lentiviral Lyfgenia); TDT approved 16 January 2024; label expanded to patients aged 2 years and older in July 2026
> - **EU:** conditional marketing authorisation 9 February 2024
> - By mid-2026 Casgevy was approved in 39 countries (Vertex, Q2 2026 results).

### 1.6 ClinicalTrials.gov number

> "**ClinicalTrials.gov:** [NCT05329649]" (`:51`); reference 4 "ClinicalTrials.gov NCT05329649 (CTX001)" (`:120`)

**Verdict: Corrected (mislabelled).**

**Evidence (ClinicalTrials.gov API records)**

| NCT | Study | Phase | Enrollment | Status |
|---|---|---|---|---|
| NCT05329649 [13a] | CLIMB-151: "Evaluation of Safety and Efficacy of CTX001 in Pediatric Participants With Severe Sickle Cell Disease" | 3 | 13 | Active, not recruiting (last update 2026-07-01) |
| NCT03655678 [13b] | CLIMB-111 (TDT), pivotal trial behind the approvals | 2/3 | 59 | Completed |
| NCT03745287 [13c] | CLIMB-121 (SCD), pivotal trial behind the approvals | 2/3 | 63 | Completed |
| NCT05356195 [13d] | CLIMB-141, paediatric TDT | 3 | 16 | Active, not recruiting |

So NCT05329649 is a real CTX001 trial, but it is the paediatric SCD study, not the trial behind the 2023 approvals.

**Proposed wording**

> **Pivotal trials:** CLIMB-121 (SCD, [NCT03745287](https://clinicaltrials.gov/study/NCT03745287)) and CLIMB-111 (TDT, [NCT03655678](https://clinicaltrials.gov/study/NCT03655678)). Paediatric studies CLIMB-151 ([NCT05329649](https://clinicaltrials.gov/study/NCT05329649)) and CLIMB-141 ([NCT05356195](https://clinicaltrials.gov/study/NCT05356195)) supported the 2026 label expansion to ages 2+.

Also update reference 4. The `ct2/show` URLs still redirect, but the current form is `clinicaltrials.gov/study/NCT…`.

### 1.7 EDIT-101

> "**Method:** AAV-SaCas9 + guide RNA + donor template via subretinal injection" (`:55`); "**Status:** Phase 1/2 trial NCT03872479" (`:56`); "EDIT-101 and NTLA-2001 remain investigational" (`:73`)

**Verdict: Corrected (method) and Outdated (status).**

**Evidence**

- **Method.**
  - EDIT-101 is an AAV5 vector encoding *S. aureus* Cas9 and **two** guide RNAs.
  - The guides excise or invert the intronic IVS26 (c.2991+1655A>G) variant that creates a cryptic splice site.
  - **There is no donor template** [18].
- **BRILLIANCE results.** Pierce et al., NEJM 2024 [18]:
  - 14 participants (12 adults, 2 children).
  - No serious adverse events related to treatment or procedure.
  - Some participants improved on at least one measure, but only a minority met the pre-set responder threshold.
- **Status.**
  - In November 2022 Editas paused enrollment and said it would seek a partner. It cited 3 of 14 patients meeting the responder threshold and a small addressable population, about 300 US IVS26 homozygotes [19].
  - Editas then stopped internal investment in the programme (secondary source [19]).
  - ClinicalTrials.gov still shows NCT03872479 with status "UNKNOWN" (last update 2022-12-05) [13e].
  - No restart was found as of October 2026.
- **Consensus.** This is a single trial from one sponsor (US sites). Its efficacy conclusions are **Unconfirmed-single-study**.

**Proposed wording**

> - **Method:** AAV5 vector carrying SaCas9 and two guide RNAs that cut out the IVS26 splice mutation (no donor template), given by subretinal injection
> - **Status:** Phase 1/2 BRILLIANCE trial ([NCT03872479](https://clinicaltrials.gov/study/NCT03872479)); results in 14 participants published in NEJM 2024 (Pierce et al.): acceptable safety, improvement in a minority. Editas paused the programme in November 2022 to seek a partner; no further development has been announced.

### 1.8 NTLA-2001 / nexiguran ziclumeran (nex-z)

> "**Indication:** Hereditary transthyretin (ATTR) amyloidosis with cardiomyopathy" (`:59`); "**Key Data:** Single dose yields > 90 % TTR knockdown for 4–6 months" (`:61`); "**Status:** Phase 1 NCT04601051 → Phase 3 MAGNITUDE trial" (`:62`)

**Verdict: Outdated / incomplete.**

**Evidence**

- **Indication.**
  - The Phase 1 trial NCT04601051 enrolled both hereditary ATTR with polyneuropathy (ATTRv-PN) and ATTR cardiomyopathy (ATTR-CM): 72 participants, completed, last update 2026-01-30 [13f].
  - The ATTR-CM cohort includes **wild-type** (non-hereditary) disease, not only hereditary disease [21].
- **Data.**
  - The first report showed a mean 87% serum TTR reduction at day 28 with 0.3 mg/kg [20].
  - The ATTR-CM cohort (n=36) showed about 90% mean reduction sustained through 12 months [21].
  - Two-year PN data from Intellia show durable reductions (company data [22a], not separately peer-reviewed at 2 years).
  - So "4–6 months" understates the durability observed.
- **Phase 3 programme.**
  - MAGNITUDE, ATTR-CM: NCT06128629, about 1,200 planned, recruiting [13g].
  - MAGNITUDE-2, ATTRv-PN: NCT06672237, about 60 planned, recruiting [13h].
- **Safety event and clinical holds.**
  - 27 Oct 2025: Intellia disclosed a Grade 4 transaminase and bilirubin elevation in a MAGNITUDE participant dosed 30 Sep 2025.
  - 29 Oct 2025: FDA placed both Phase 3 trials on clinical hold.
  - 5 Nov 2025: the participant died. Intellia later attributed the death to sepsis after a gastrointestinal complication, which is the company's account [22].
  - 27 Jan 2026: the MAGNITUDE-2 hold was lifted [23].
  - 2 Mar 2026: the MAGNITUDE hold was lifted. Conditions included enhanced liver monitoring, steroid-management guidance and exclusion of patients with liver abnormalities [24, 25].
  - Intellia's 6 Aug 2026 Q2 report states "Enrollment successfully reinitiated in nex-z Phase 3 clinical trials". MAGNITUDE-2 enrollment is expected to complete in H2 2026 [26].
  - Nex-z is co-developed with Regeneron.
- **Related development.** Intellia's second in-vivo CRISPR product, lonvo-z (NTLA-2002, hereditary angioedema), reported positive Phase 3 HAELO data in NEJM. Intellia expects FDA to accept its BLA in H2 2026 and a US launch in H1 2027 [26]. If approved, it would be the first approved **in vivo** CRISPR therapy. As of 2026-10-22 it is **not approved**.
- **Consensus.** The TTR knockdown data come from one sponsor's trial run at sites in several countries (UK, New Zealand, Sweden, US and others) [20, 21]. Clinical-outcome efficacy (deaths and cardiovascular events) is **not yet shown**: that is MAGNITUDE's purpose.

**Proposed wording**

> ### In vivo Therapy: NTLA-2001 (nexiguran ziclumeran, “nex-z”; Intellia/Regeneron)
> - **Indication:** Transthyretin (ATTR) amyloidosis — both hereditary polyneuropathy (ATTRv-PN) and cardiomyopathy (ATTR-CM, hereditary or wild-type)
> - **Method:** Lipid nanoparticles deliver Cas9 mRNA + guide RNA to the liver; *TTR* knockout via NHEJ (no donor template)
> - **Key Data:** In the Phase 1 trial (NCT04601051, 72 participants) a single infusion lowered serum TTR by about 90% on average, sustained for at least 1–2 years. Clinical-outcome benefit is not yet proven.
> - **Status:** Phase 3 MAGNITUDE (ATTR-CM, NCT06128629) and MAGNITUDE-2 (ATTRv-PN, NCT06672237). Both were placed on FDA clinical hold in October 2025 after a Grade 4 liver-injury event; the patient later died. The holds were lifted in January (MAGNITUDE-2) and March 2026 (MAGNITUDE), with added liver monitoring, and enrollment has resumed.

### 1.9 "Commercially available in the US and UK"

> "**CTX001/Casgevy** is **commercially available** in the US and UK." (`:68`); "Patients typically remain hospitalized for several weeks." (`:71`)

**Verdict: Outdated.**

**Evidence**

- **Availability.** Casgevy was approved in 39 countries by Q2 2026 [11].
- **Uptake was slow at first, then accelerated** (all from Vertex SEC filings):
  - 2024: revenue $10.0 M [10].
  - Through 30 Jun 2025: about 115 patients had a first cell collection, 29 were infused, and more than 75 authorised treatment centres were active [9].
  - Full-year 2025: revenue $115.8 M; 64 patients infused; 147 first cell collections [10].
  - Q2 2026: revenue $76 M, up 151% year on year [11]. On the Q2 2026 call management said H1 2026 infusions exceeded those for all of 2025. That figure is from the call, not the 8-K text, and the exact number was not verified.
  - Vertex estimates more than 60,000 eligible patients in approved countries [10].
- **Hospital stay.** "Several weeks" is consistent with the pivotal trials, where neutrophil engraftment took a median of about 4 weeks after infusion [7, 8].
- **Conditioning toxicity.** Myeloablative busulfan conditioning is the main toxicity and a key barrier to uptake [7, 8].

**Proposed wording**

> - **CTX001/Casgevy** is commercially available — approved in 39 countries by mid-2026 (US, UK, EU, Canada, Switzerland, Gulf states and others). Uptake is still small relative to need: 64 patients were infused worldwide in 2025, against an estimated >60,000 eligible patients, although infusions accelerated in 2026.

### 1.10 US price and payment

> "**Casgevy list price:** \$2.2 million USD per one-time treatment" (`:80`)

**Verdict: Confirmed** [17, 16].

For context:

- Lyfgenia's US list price is $3.1 M, and it carries a boxed warning for haematologic malignancy [16].
- ICER judged Casgevy cost-effective at prices up to about $2.05 M [16] (secondary source for the ICER figure).
- About 90% of US patients have reimbursed access, according to Vertex [10].
- The payment-model bullets (`:81-84`) were not individually verified. They are generic, and no specific contract terms were checked.

**Proposed wording (keep, and add)**

> (Lyfgenia, approved the same day, lists at \$3.1 million.)

### 1.11 UK price, numbers of patients and centres

> "**NHS list price:** £1.65 million GBP per patient (via Innovative Medicines Fund)" / "Confidential discount agreement; up to ~ 460 eligible patients" / "Seven NHS specialist centres across England" (`:89-91`); source cited as Nature Biotechnology s41587-023-02415-8 (`:93`)

**Verdict: Corrected (the figures conflate two separate NICE decisions).**

**Evidence**

- **TDT.**
  - NICE recommended Casgevy for TDT on 8 Aug 2024 through the **Innovative Medicines Fund**.
  - List price about £1.65 M, with a confidential discount.
  - About **460** eligible patients aged 12+ in England.
  - Treated at **7** specialist centres [14].
- **SCD.**
  - NICE initially did not recommend it (March 2024).
  - On 31 Jan 2025 it recommended Casgevy for SCD under a **managed-access** agreement, at the same £1.65 M list price with a confidential commercial deal.
  - About 50 patients a year were expected to be treated initially [15].
  - Reports put the eligible SCD population at about 1,700 [15]. This figure was not checked against NICE's own documents.
- **Scotland.** Reimbursement for SCD was reported in January 2026. This was found only in secondary reporting during this review and was not confirmed against the Scottish Medicines Consortium; treat it as unverified.
- **The cited Nature Biotechnology article** (s41587-023-02415-8, "The world's first CRISPR therapy is approved: who will receive it?") is paywalled. Its content could not be checked here, and it predates both NICE decisions. The figures should instead be cited to NHS England and NICE.

**Proposed wording**

> - **Transfusion-dependent β-thalassemia:** recommended by NICE in August 2024 via the Innovative Medicines Fund; list price £1.65 million per patient with a confidential discount; about 460 eligible patients aged 12+ in England, treated at seven NHS specialist centres.
> - **Sickle cell disease:** initially rejected by NICE (March 2024), then recommended in January 2025 under a managed-access agreement at the same list price with a confidential discount; about 50 patients a year initially.
>
> > Sources: [NHS England, Aug 2024](https://www.england.nhs.uk/2024/08/gene-editing-therapy-that-could-cure-blood-disorder-thalassaemia-for-nhs-patients/); [Pharmaceutical Technology, Jan 2025](https://www.pharmaceutical-technology.com/news/nhs-england-to-offer-casgevy-for-sickle-cell-disease-patients/)

### 1.12 Future directions and conclusion

> "Improving HDR efficiency in non-dividing cells" … "Non-viral delivery platforms (LNPs, nanoparticles) to broaden tissue targeting" (`:99-102`); "With **Casgevy** already in clinical practice at a list price near \$2 million, and multiple in vivo therapies advancing through trials, this technology is poised to transform medicine" (`:108`)

**Verdict: Confirmed in direction / Corrected in detail.**

**Evidence**

- **LNP delivery is already clinical, not just "future":**
  - NTLA-2001 [20, 21]
  - lonvo-z [26]
  - the CPS1 base editor [27]
- **The conclusion's price** should read $2.2 M (US list price) [17].
- **"Poised to transform medicine" needs balance.** It should acknowledge:
  - the conditioning toxicity [7, 8]
  - the slow uptake [9, 10]
  - the 2025 nex-z liver-safety event [22]
- **Nothing here bears on aging or immortality.** These are monogenic-disease therapies.

**Proposed wording (conclusion)**

> CRISPR-based therapies are a real clinical advance for some single-gene diseases. **Casgevy** (US list price \$2.2 million) is approved in dozens of countries, and in vivo editors delivered by lipid nanoparticles are in Phase 3. They remain expensive and demanding (Casgevy requires chemotherapy conditioning), uptake is still small, and serious adverse events have occurred in trials. None of these therapies targets aging itself.

---

## Claim 2: `app/src/App.tsx` verdict and methodology text

### 2a. "Velocity peaked … — the era of antibiotics, vaccines and falling child mortality"

> "Velocity peaked at **{peak.value} yr / yr around {peak.year}** — the era of antibiotics, vaccines and falling child mortality — and the 30-year trend is currently …" (`app/src/App.tsx:369-371`)

**Verdict: Corrected.** The sentence is hard-coded and attaches the same explanation to every series. It is roughly right for the world aggregate, but wrong for many single countries.

**Evidence: peaks recomputed from the repository data** (10-year trailing OLS)

| Series | Peak v (yr/yr) | Peak year | Likely driver |
|---|---|---|---|
| World | 0.91 | 1952 | Post-war global spread of public health, DDT/malaria control, vaccines, antibiotics |
| Japan | 9.03 | 1948 | Rebound after WWII deaths |
| Russia | 4.10 | 1924 | Rebound after civil war and the 1921–22 famine |
| France | 2.36 | 1924 | Rebound after WWI and the 1918 influenza |
| China | 2.16 | 1968 | Rebound after the 1959–61 famine |
| Brazil | 1.16 | 1951 | Mid-century transition |
| UK | 0.91 | 1926 | Rebound after WWI and influenza |
| US | 0.87 | 1927 | Rebound after influenza; pre-antibiotic |
| Nigeria | 0.70 | 1978 | Post-independence child-mortality decline |
| India | 0.57 | 1984 | Child-mortality decline |
| Australia | 0.41 | 1925 | Pre-antibiotic |

- **Many peaks predate antibiotics.** Penicillin was in mass use only from the mid-1940s. Many peaks are rebound artifacts: the 10-year slope measures recovery from a catastrophe, not underlying progress.
- **What the literature says drove the fastest secular gains:**
  - **Preston (1975, US)** [44]: shifts in the curve linking life expectancy to income explain about 75–90% of world life-expectancy growth from the 1930s to the 1960s. He attributes this to factors exogenous to a country's own income, such as imported public-health technology.
  - **Cutler, Deaton & Lleras-Muney (2006, US/UK)** [45]:
    - Before 1900, nutrition and public works (clean water, sanitation) mattered most.
    - In the early 20th century, public health, vaccination and later antibiotics drove gains.
    - After about 1970, gains in rich countries came mainly from falling cardiovascular mortality at older ages.
  - **Cutler & Miller (2005, US)** [46]: clean water alone accounted for about half of the urban mortality decline in early-20th-century US cities.
  - **Omran's epidemiologic transition (Egypt/US)** [47] and **Riley (2001, US)** [52] describe the shift from infectious to chronic disease mortality, starting with infants and children.
  - **Acemoglu & Johnson (2007, US)** [48] use the post-1940 "international epidemiological transition" (antibiotics, DDT, WHO campaigns) as a natural experiment.
  - **China's 1950–80 decline** is attributed mainly to public health and education campaigns, not income (Babiarz et al. 2015, US/China team) [49].
  - **Szreter (1988, UK)** [50] argues against attributing 19th-century British gains mostly to nutrition. He emphasises public-health intervention.
- **Consensus.** Teams in the US, UK, Europe and China agree that the fastest secular gains came from falling infectious and child mortality in the late 19th to mid-20th centuries. Sanitation and public health are the main levers, with vaccines and antibiotics important after about 1940. They also agree that the decline in childhood mortality, not aging biology, produced those gains.

**Proposed wording (TSX)**

> Velocity peaked at **{peak.value} yr / yr around {peak.year}**. In single-country series such peaks are often rebounds after wars, famines or pandemics. Globally, the fastest sustained gains came in the mid-20th century, as sanitation, public health, vaccines, antibiotics and malaria control cut infant and child deaths. The 30-year trend is currently …

### 2b. Longevity escape velocity: consensus or hypothesis?

> "(the point where each calendar year lived adds a full year of life expectancy, so remaining life expectancy stops shrinking)" (`app/src/App.tsx:365-366`); "Longevity escape velocity (LEV) is the point where v(t) >= 1: every calendar year lived adds at least one more year of remaining life expectancy." (`app/src/analytics.ts:8-9`)

**Verdict: Speculative** (the concept), and **Corrected** (the definition used).

**Evidence**

- **Origin.**
  - The concept comes from Aubrey de Grey (UK/US; de Grey 2004, PLoS Biology) [31], building on the SENS programme [32].
  - Ray Kurzweil popularised it and predicts LEV around 2029–2035 [80].
  - Neither is a demographic forecast based on mortality data.
- **No peer-reviewed demographic forecast predicts LEV this century.**
  - Major forecasting groups project world gains of about 0.14–0.16 yr/yr to 2050:
    - UN Population Division [42]
    - IHME / GBD, US with global collaborators [40]
  - High-longevity forecasts reach about 0.25 yr/yr. Examples are Oeppen & Vaupel's record-LE trend (UK/Germany/Denmark) [33] and Vaupel et al. 2021 [34].
  - Olshansky et al. 2024 (US) [35] argue gains are decelerating and that radical life extension is "implausible" this century unless aging itself is slowed. That is a scenario no one can yet forecast.
- **Critique by gerontologists.** In 2005, 28 senior biogerontologists from several countries published a detailed rebuttal of the SENS agenda [37]. They did not rule out future progress, but rejected claims of imminent indefinite life extension.
- **What de Grey actually defined.** He defined the threshold in terms of **age-specific mortality**, not period life expectancy at birth [31]. His words:

  > "mortality rates fall so fast that people's remaining (not merely total) life expectancy increases with time … the ratio of the mortality rates at consecutive ages (in the same year) in the age range where most people die, which is only about 10% per year. I term this rate of reduction of age-specific mortality risk 'actuarial escape velocity' (AEV)."

  He also calls period life expectancy "a purely artificial construction".
- **Why "remaining life expectancy stops shrinking" does not follow from period e0 rising 1 yr/yr.**
  - Period e0 is dominated by deaths at young ages.
  - An individual's remaining life expectancy is e at their *current* age x, evaluated over their own future.
  - One year later, the relevant quantity is e at age x+1 in year t+1. It can keep falling even while e0 rises fast, as happened in the mid-20th century, when child-mortality gains drove e0 while old-age mortality barely moved [44, 45, 53].
  - Conversely, AEV would not require period e0 to rise exactly 1 yr/yr.

  See Claim 3 for a formal statement.
- **Consensus.** No credible demographic, actuarial or biogerontological body treats LEV as an established or expected outcome. It is a speculative hypothesis advocated mainly by de Grey, Kurzweil and associated groups.

**Proposed wording (TSX, line 365-366)**

> (a simplified proxy for “longevity escape velocity”: period life expectancy at birth rising one year per calendar year. De Grey’s original “escape velocity” is a different, stricter test: age-specific death rates falling about 10% a year, so that a living person’s remaining life expectancy grows. LEV is a speculative hypothesis, not a demographic forecast.)

**Proposed wording (`analytics.ts:8-9` comment)**

> // The dashboard uses v(t) >= 1 as a simple *proxy* for “longevity escape
> // velocity”: period life expectancy at birth rising >= 1 year per calendar
> // year. This is not de Grey’s actuarial definition (age-specific mortality
> // falling ~10%/yr so that remaining life expectancy at a given age rises),
> // and period e0 reaching 1 yr/yr is neither necessary nor sufficient for it.

### 2c. Are gains accelerating or decelerating?

> "… and the 30-year trend is currently {positive|negative} …" / "Extrapolated forward, that trend never crosses the threshold: on the current demographic trajectory, escape velocity is not being approached." (`app/src/App.tsx:370-381`)

**Verdict: Confirmed (direction).** It needs context: the latest velocity is COVID-depressed, and the linear ETA can produce spurious dates.

**Evidence from the repository data**

| Series | Velocity at 2023 | 30-yr trend | ETA |
|---|---|---|---|
| World | 0.108 | -0.0010 | none |
| Japan | 0.090 | -0.0026 | none |
| US | -0.107 | -0.0087 | none |
| UK | -0.008 | -0.0062 | none |
| France | 0.057 | -0.0055 | none |
| China | 0.163 | -0.0075 | none |
| India | 0.198 | -0.0049 | none |
| Brazil | -0.031 | -0.0113 | none |
| Australia | 0.124 | -0.0059 | none |
| Russia | 0.085 | +0.0378 | ≈2047 |
| Nigeria | 0.281 | +0.0058 | ≈2147 |

- **The 2023 world velocity is depressed** because the 10-year window spans the COVID dip. World period LE was:

  | 2000 | 2010 | 2019 | 2020 | 2021 | 2022 | 2023 |
  |---|---|---|---|---|---|---|
  | 66.43 | 70.09 | 72.61 | 71.92 | 70.87 | 72.64 | 73.17 |

  The pre-COVID gain was about 0.33 yr/yr over 2000–2019 and about 0.25 yr/yr over 2010–2019.
- **The two positive trends are artifacts:**
  - Russia's comes from its recovery after the 1990s–2000s mortality crisis (cf. Leon et al. on Russia; Jdanov/Shkolnikov at MPIDR) [57].
  - Nigeria's comes from catch-up child-mortality decline.

  Linear extrapolation of a rebound slope is not a forecast. The resulting ETAs should be labelled as such.

**Evidence from the literature: deceleration in long-lived countries is the majority finding, with caveats**

- **Olshansky, Willcox, Demetrius & Beltrán-Sánchez 2024 (US)** [35]:
  - Data: 8 longest-lived countries plus Hong Kong and the US, 1990–2019.
  - Improvement decelerated after 1990.
  - Survival to 100 is unlikely to exceed 15% for females or 5% for males this century.
  - Jdanov & Jasilionis (MPIDR, Germany) [36] responded that both optimistic and pessimistic scenarios remain plausible.
- **Oeppen & Vaupel 2002 (UK/Germany/Denmark)** [33]: record life expectancy rose almost linearly, about 2.4 yr/decade (≈3 months/yr), for 160 years.
- **Vaupel, Villavicencio & Bergeron-Boucher 2021 (Denmark/Spain)** [34]:
  - The best-practice trend continued at "almost 2.5 y per decade".
  - Future pace is uncertain.
  - Even this optimistic benchmark is about 0.25 yr/yr, a quarter of the LEV proxy.
- **Slowdowns and stalls in high-income countries** are reported by independent teams in several countries:
  - Ho & Hendi 2018, US: 18 high-income countries, 2014–15 declines [54].
  - Mehta, Abrams & Myrskylä 2020, US/Germany/Finland: US stall driven by cardiovascular disease [55].
  - Woolf & Schoomaker 2019, US: US LE fell 2014–2017 [56].
  - Leon, Jdanov & Shkolnikov 2019, UK/Germany/Russia: England and Wales slowdown versus 22 countries [57].
- **COVID-19 losses and partial rebound:**
  - Aburto et al. 2022, UK/Denmark/Germany: 29 countries [59].
  - Schöley et al. 2022: western Europe rebounded in 2021–22; the US and eastern Europe had sustained deficits [58].
  - WHO excess-mortality estimates, Msemburi et al. 2023 [60].
  - UN WPP 2024 [42]: world LE fell from 72.6 (2019) to 70.9 (2021), and recovered to 73.3 (2024).
- **Forward forecasts:**
  - GBD 2021 Forecasting (Vollset et al. 2024) [40]: global LE rises from 73.6 (2022) to 78.1 (2050), about +4.5 years or ≈0.16 yr/yr.
  - UN WPP 2024 [42]: about 77.4 by 2054, ≈0.14 yr/yr.
  - GBD 2023 demographics [41]: age-standardised mortality fell 66.6% over 1950–2023, a large but decelerating improvement.
- **Lifespan-limit debate (separate from the LE trend):**
  - Dong, Milholland & Vijg 2016 (US) [61] claimed a limit to maximum reported age at death of about 115.
  - Five independent rebuttals followed in Nature 2017, from teams in Czech Republic/Denmark/Germany, Canada/US, Canada, Netherlands/UK, and Netherlands [62–66].
  - Rootzén & Zholud 2017 (Sweden) [67] found no finite limit detectable in the data, but noted that life is "short".
  - Pearce & Raftery 2021 (US) [68] give probabilistic forecasts of the maximum reported age by 2100: a record around 115–130 is likely, and above 130 very unlikely.
  - This debate is **unresolved**. Both sides agree that the *maximum* and the *average* move slowly.
- **Mortality-plateau debate:**
  - Barbi et al. 2018 (Italy/Denmark/US) [69] reported a hazard plateau after age 105 in 3,836 Italians.
  - Critiques:
    - Newman 2018 (Australia/UK): data errors can produce plateaus [70].
    - Beltrán-Sánchez, Austad & Finch 2018 (US) [71].
    - Gavrilov & Gavrilova 2019 (US) [72].
  - Alvarez et al. 2021 (Denmark and others) [73] found results consistent with a plateau in better-validated data from several countries, but with wide uncertainty.
  - Even if a plateau exists, it is at about 50% annual mortality. That is irrelevant to LEV.
- **Consensus.** Independent groups in the US, UK, Germany, Denmark and other countries agree:
  - Current global and best-practice LE gains are about 0.1–0.3 yr/yr, far below 1 yr/yr.
  - No major forecaster projects acceleration toward 1 yr/yr.

  Whether best-practice gains are slowing (Olshansky) or merely noisy around a linear trend (Vaupel) is genuinely contested.

**Proposed wording (TSX, after the ETA sentence)**

> (Note: the latest value is still depressed by the COVID-19 dip inside the 10-year window; the world gained about 0.25–0.33 years per year in 2000–2019. Positive trends in countries recovering from crises, such as Russia, reflect rebounds, not acceleration toward escape velocity.)

### 2d. "Breakthroughs in aging biology (senolytics, partial reprogramming, gene therapy) would only register here once they measurably cut death rates at scale."

> "Honest caveat: this instrument measures **period life expectancy** — the mortality of the present, not a forecast. Breakthroughs in aging biology (senolytics, partial reprogramming, gene therapy) would only register here once they measurably cut death rates at scale. The gauge tells us where we are, not what is about to be invented." (`app/src/App.tsx:385-389`)

**Verdict: Confirmed (logic) / Corrected (implied status).** The logic is right. But calling these "breakthroughs" implies more human evidence than exists. As of October 2026:

- No therapy is approved for aging.
- No aging-targeted intervention has shown an all-cause mortality reduction in a randomised trial.

**Evidence (state of human evidence, October 2026)**

- **Senolytics.**
  - Unity Biotechnology's UBX0101 failed its Phase 2 trial in knee osteoarthritis (2020) [75].
  - UBX1325 (ASPIRE, diabetic macular oedema) missed its primary non-inferiority endpoint. In June 2025 Unity's board approved dissolution of the company [76]. The outcome of the stockholder vote was not verified.
  - Mayo Clinic and other US groups have run small dasatinib plus quercetin studies:
    - diabetic kidney disease, n=9, open-label [77]
    - idiopathic pulmonary fibrosis, n=14, open-label [78]
    - mild Alzheimer's, n=5, Phase 1 [79]
  - The largest RCT, in postmenopausal women (n=60), missed its primary bone endpoint (P=0.611). It showed only an exploratory benefit in the highest-senescence tertile [74].
  - **Status:** small, mostly single-centre US studies with mixed results; **no replicated efficacy**.
- **Partial reprogramming.**
  - Animal evidence:
    - Ocampo et al. 2016 (US/Spain): cyclic OSKM in progeroid mice [81].
    - Lu et al. 2020 (US/international): OSK restores vision in mouse glaucoma and aging models [82].
  - First in human: Life Biosciences ER-100 (intravitreal, inducible OSK; NCT07290244). The first patient was dosed on 9 Jun 2026 [83].
  - Company-reported interim data from 8 Oct 2026 [84]:
    - 3 glaucoma participants
    - well tolerated to day 56, with no dose-limiting toxicities or serious adverse events
    - visual-field improvement in 2 of 3

    These data are not peer-reviewed. Status: **Unconfirmed-single-study** (3 patients, one sponsor).
  - The human-trial status of Altos Labs and Retro Biosciences was **not verified** in this review.
- **Gene therapy.**
  - Approved gene therapies (Casgevy and others) treat monogenic diseases, not aging (Claim 1).
  - No gene therapy for aging has peer-reviewed human efficacy data. Unregulated "longevity gene therapy" self-experiments are anecdotes, not evidence.
- **Rapamycin / mTOR inhibitors.**
  - In older adults, low-dose mTOR inhibition improved vaccine response [85].
  - Mannick et al. 2021 [86]: a Phase 2b trial positive; the Phase 3 (RTB101) missed its primary endpoint.
  - The PEARL trial (48 weeks, low-dose intermittent; Moel et al. 2025 [87]) was null on its primary visceral-fat endpoint. It showed some secondary benefits in women.
- **Metformin.**
  - The TAME trial [88] is designed for 3,000 participants aged 65–79 over about 6 years. As of 2024 it was still not fully funded [89]. No primary source confirming enrollment as of 2026 was found.
  - Observational evidence conflicts:
    - Bannister et al. 2014 (UK): a survival advantage over non-diabetic controls [90].
    - Keys et al. 2022 (Denmark, including twin analyses): no such advantage [91].
  - RCTs show metformin blunts exercise adaptations in older adults (Konopka 2019; Walton 2019, US) [92, 93].
- **GLP-1 receptor agonists.**
  - SELECT (semaglutide in obesity without diabetes, 41 countries) [94]: all-cause death HR 0.81 (0.71–0.93). This was not formally significance-tested, because the hierarchical CV-death endpoint failed (HR 0.85).
  - FLOW (semaglutide in diabetic kidney disease) [95] and a meta-analysis of 8 cardiovascular outcome trials [96] support lower mortality **in disease populations**.
  - None of these is an aging indication.
- **Biomarkers ("biological age clocks").**
  - Main clocks: Horvath (US) [97], Hannum (US) [98], PhenoAge [99], GrimAge [100], DunedinPACE (US/NZ/UK) [101].
  - They predict mortality in many cohorts.
  - Reliability concerns: Higgins-Chen et al. 2022 [102].
  - Expert consortium statements (Moqri et al. 2023, 2024; international) say no aging biomarker is yet validated as a surrogate endpoint for regulatory use [103, 104].
  - CALERIE, the caloric-restriction RCT [105], slowed DunedinPACE modestly but not other clocks.
- **Framework.** The hallmarks-of-aging framework (López-Otín et al. 2023, Spain/France/US) [106] guides research. It is not evidence that any intervention works in humans.
- **Consensus.** Across the US, UK, Europe and other regions:
  - No regulator has approved any therapy for aging.
  - No aging-targeted drug has replicated, randomised evidence of extending human lifespan or cutting all-cause mortality in the general older population.

**Proposed replacement text for the caveat (TSX, lines 385-389)**

> Honest caveat: this instrument measures **period life expectancy** — the mortality of the present, not a forecast. “Longevity escape velocity” is a speculative hypothesis, not a scientific consensus. No therapy is approved to slow or reverse human aging. As of 2026, senolytics, partial reprogramming and gene editing have only small, early-phase human studies, mostly on surrogate endpoints and with mixed results, and none has shown a reduction in deaths from aging. Major forecasts (UN World Population Prospects 2024; Global Burden of Disease 2021) project world gains of roughly 0.15 years per year to 2050. Even the best-performing countries have gained only about 0.25 years per year since 1840 (Oeppen & Vaupel 2002; Vaupel et al. 2021). Any future breakthrough would register here only once it measurably cut death rates at scale. The gauge tells us where we are, not what is about to be invented.

### 2e. Methodology text

> "**Escape velocity:** v(t) ≥ {LEV_THRESHOLD} year of life expectancy per calendar year. The ETA extrapolates the 30-year linear trend of the velocity; it is a trajectory readout, not a prophecy." (`app/src/App.tsx:427-429`); "**Limitation:** period life expectancy summarizes current death rates. A true immortality probability would need cohort projections and biological-aging biomarkers" (`:432-434`)

**Verdict: Confirmed (limitation) / Corrected (escape-velocity definition is a proxy).**

**Evidence:** see 2b and Claim 3. The limitation statement agrees with standard demography: period LE is a synthetic summary of one year's death rates [31, 53].

"Biological-aging biomarkers" should be qualified as not yet validated [103, 104].

**Proposed wording**

> - **Escape velocity (proxy):** v(t) ≥ {LEV_THRESHOLD} year of period life expectancy at birth per calendar year. This is a simplification of de Grey’s “actuarial escape velocity”, which requires age-specific death rates to fall about 10% per year. The ETA linearly extrapolates the 30-year trend of the velocity. Rebounds after wars, famines or pandemics can produce spurious ETAs; it is a trajectory readout, not a prophecy. The latest data year is 2023.
> - **Limitation:** period life expectancy summarizes current death rates. A true immortality probability would need cohort projections and age-specific mortality trends. Biological-aging biomarkers (epigenetic clocks) are not yet validated as surrogate endpoints. This dashboard deliberately sticks to what is actually measured today.

---

## Claim 3: the core metric, LEV as period LE gain ≥ 1 yr/yr

> `export const LEV_THRESHOLD = 1;` (`app/src/analytics.ts:16`), applied to v(t) = d e0(t)/dt, where e0 is period life expectancy at birth (`app/src/analytics.ts:3-9`, `App.tsx:427-429`)

**Verdict: Corrected (it is a proxy, not the definition). The current-rate finding is Confirmed: about 0.1 yr/yr now and about 0.25–0.33 pre-COVID, far below 1.**

**Formal analysis**

Let μ(x, t) be the death rate at age x in year t. Let e_x(t) be period remaining life expectancy at age x.

- **De Grey's actuarial escape velocity** [31] concerns a living person aged x in year t. Their remaining life expectancy should not shrink as they age:

  e_{x+1}(t+1) ≥ e_x(t).

  For adult mortality that roughly follows a Gompertz curve with slope b, this requires

  -∂ ln μ / ∂t ≥ b,

  i.e. age-specific death rates falling about 8–10% per year at the ages where most deaths occur. De Grey says "about 10% per year".
- **Historical rates.** Old-age mortality has fallen by about 1–2% per year in the best-performing countries since the 1950s. This is shown by Kannisto et al. 1994 (Denmark/US, 27 countries) [53] and Vaupel 2010 [39]. That is roughly a tenth of the required rate.
- **Period e0 rising 1 yr/yr is not equivalent.**
  1. e0 is heavily weighted by infant and child deaths. Eliminating child mortality can raise e0 very fast (several yr/yr in rebounds) without changing e_x for adults.
  2. Conversely, rejuvenation that cut adult μ by 10%/yr would raise e0 by an amount depending on the age structure of deaths. That need not be exactly 1 yr/yr at the moment AEV is reached.
  3. Period measures lag cohort reality when mortality is falling. Cohort life expectancy exceeds period life expectancy in that case [34].

  So the threshold d e0/dt ≥ 1 is neither necessary nor sufficient for AEV. It is, however, a reasonable *order-of-magnitude* sanity check: if e0 rises much more slowly than 1 yr/yr, AEV is clearly not being reached.
- **Better formalisations the dashboard could add later** (suggestions only; nothing was implemented here):
  - Annual % decline in age-specific death rates at ages 60–90, compared with about 10%/yr.
  - The change in e65 or e80 per calendar year, compared with the roughly 1-year-per-year decrease in e_x from ageing one year.

  Both are computable from the Human Mortality Database, not from the OWID e0 series currently used.

**Current world rate**

- Repository data: 2023 velocity 0.108 yr/yr (COVID-affected window); 2000–2019 ≈ 0.33 yr/yr; 2010–2019 ≈ 0.25 yr/yr.
- UN WPP 2024 [42]: world LE 72.6 (2019), 70.9 (2021), 73.3 (2024). That is a full rebound past the pre-COVID level by 2024. The repository snapshot (73.17 in 2023) does not yet include 2024.
- Forecasts:
  - GBD 2021 [40]: ≈0.16 yr/yr to 2050.
  - UN WPP 2024 [42]: ≈0.14 yr/yr to 2054.
- **Consensus.** UN DESA, IHME/GBD, MPIDR, and the Olshansky and Vaupel groups all put current or projected gains between about 0.1 and 0.3 yr/yr. No independent source projects 1 yr/yr.

**Proposed wording:** see 2b (`analytics.ts` comment and verdict parenthesis) and 2e (methodology).

---

## Items that could not be verified (stated explicitly)

1. **The Nature Biotechnology article cited by the CRISPR document** (`nature.com/articles/s41587-023-02415-8`). The page redirects to a login wall, so its content was not checked. On 2026-10-22 the identifier did not resolve at doi.org or Crossref (HTTP 404), so it is probably an unregistered news item. Re-cite the UK figures to NHS England and NICE instead.
2. **The DOI of the Prime Medicine PM359 NEJM paper** (December 2025). Only the company press release was read [29].
3. **The PM359 NEJM paper's full author list and pages** (only the company announcement was read; see item 2).
4. **The outcome of Unity Biotechnology's stockholder vote on dissolution** (2025).
5. **TAME trial enrollment status in 2026.**
6. **The current human-trial status of Altos Labs and Retro Biosciences.**
7. **Severe paediatric busulfan liver toxicity, including one death, in the paediatric TDT cohort.** This is reported only in secondary sources and was not checked against a primary publication, so it is not used in the proposed wording.
8. **The exact number of Casgevy patients infused in H1 2026.** The 8-K gives revenue only; the comparison with 2025 comes from the earnings call.
9. **The NHS SCD eligible population (~1,700) and Scottish SCD reimbursement (January 2026).** Both come from secondary reports only.
10. **The Casgevy payment-model bullets** (`CRISPR-Autologous-Gene-Therapy.md:81-84`).

---

## References

### Regulatory, trial registries and company filings

1. US Food and Drug Administration. 2023-12-08. "FDA Approves First Gene Therapies to Treat Patients with Sickle Cell Disease." https://www.fda.gov/news-events/press-announcements/fda-approves-first-gene-therapies-treat-patients-sickle-cell-disease
2. Medicines and Healthcare products Regulatory Agency (UK). 2023-11-16. "MHRA authorises world-first gene therapy that aims to cure sickle-cell disease and transfusion-dependent β-thalassemia." https://www.gov.uk/government/news/mhra-authorises-world-first-gene-therapy-that-aims-to-cure-sickle-cell-disease-and-transfusion-dependent-thalassemia
3. European Medicines Agency. Casgevy (exagamglogene autotemcel) EPAR; conditional marketing authorisation 2024-02-09. https://www.ema.europa.eu/en/medicines/human/EPAR/casgevy
4. Paul-Ehrlich-Institut. 2023-12-22. "Authorisation recommendation for gene-editing medicine." https://www.pei.de/EN/newsroom/hp-news/2023/231222-authorisation-reommendation-gene-editing-medicine.html
5. BioSpace. 2024-01. "FDA approves Vertex, CRISPR's Casgevy to treat beta thalassemia." (secondary) https://www.biospace.com/fda-approves-vertex-crispr-s-casgevy-to-treat-beta-thalassemia
6. Frangoul H, Altshuler D, Cappellini MD, et al. 2021. "CRISPR-Cas9 Gene Editing for Sickle Cell Disease and β-Thalassemia." *New England Journal of Medicine* 384:252–260. doi:10.1056/NEJMoa2031054
7. Frangoul H, Locatelli F, Sharma A, et al. 2024. "Exagamglogene Autotemcel for Severe Sickle Cell Disease." *New England Journal of Medicine* 390:1649–1662. doi:10.1056/NEJMoa2309676
8. Locatelli F, Lang P, Wall D, et al. 2024. "Exagamglogene Autotemcel for Transfusion-Dependent β-Thalassemia." *New England Journal of Medicine* 390:1663–1676. doi:10.1056/NEJMoa2309673
9. Vertex Pharmaceuticals. 2025-08. Form 8-K Exhibit 99.1, Q2 2025 financial results. https://www.sec.gov/Archives/edgar/data/0000875320/000087532025000213/ex-991_q22025.htm
10. Vertex Pharmaceuticals. 2026-02. Form 8-K Exhibit 99.1, Q4 and full-year 2025 financial results. https://www.sec.gov/Archives/edgar/data/875320/000087532026000034/ex-991_q42025.htm
11. Vertex Pharmaceuticals. 2026-08. Form 8-K Exhibit 99.1, Q2 2026 financial results. https://www.sec.gov/Archives/edgar/data/875320/000087532026000256/ex-991_q22026.htm
12. Healio. 2026-07-02. "FDA expands Casgevy approval to children 2 years and older with sickle cell disease." (secondary) https://www.healio.com/news/hematology-oncology/20260702/fda-expands-casgevy-approval-to-children-2-years-and-older-with-sickle-cell-disease
13. ClinicalTrials.gov records, retrieved through API v2 in October 2026:
    - (a) NCT05329649 (CLIMB-151) https://clinicaltrials.gov/study/NCT05329649
    - (b) NCT03655678 (CLIMB-111) https://clinicaltrials.gov/study/NCT03655678
    - (c) NCT03745287 (CLIMB-121) https://clinicaltrials.gov/study/NCT03745287
    - (d) NCT05356195 (CLIMB-141) https://clinicaltrials.gov/study/NCT05356195
    - (e) NCT03872479 (EDIT-101 BRILLIANCE) https://clinicaltrials.gov/study/NCT03872479
    - (f) NCT04601051 (NTLA-2001 Phase 1) https://clinicaltrials.gov/study/NCT04601051
    - (g) NCT06128629 (MAGNITUDE) https://clinicaltrials.gov/study/NCT06128629
    - (h) NCT06672237 (MAGNITUDE-2) https://clinicaltrials.gov/study/NCT06672237
14. NHS England. 2024-08. "Gene-editing therapy that could cure blood disorder thalassaemia for NHS patients." https://www.england.nhs.uk/2024/08/gene-editing-therapy-that-could-cure-blood-disorder-thalassaemia-for-nhs-patients/
15. Pharmaceutical Technology. 2025-01. "NHS England to offer Casgevy for sickle cell disease patients." (secondary) https://www.pharmaceutical-technology.com/news/nhs-england-to-offer-casgevy-for-sickle-cell-disease-patients/
16. PharmaLive. 2023-12. "Bluebird's newly approved SCD gene therapy faces rough road with hefty price tag, boxed warning." (secondary) https://www.pharmalive.com/bluebirds-newly-approved-scd-gene-therapy-faces-rough-road-with-hefty-price-tag-boxed-warning/
17. BioPharma Dive. 2023-12. "Pricey new gene therapies for sickle cell pose access test." https://www.biopharmadive.com/news/crispr-sickle-cell-price-millions-gene-therapy-vertex/702066/

### In vivo editing

18. Pierce EA, Aleman TS, Jayasundera KT, et al. 2024. "Gene Editing for CEP290-Associated Retinal Degeneration." *New England Journal of Medicine* 390:1972–1984. doi:10.1056/NEJMoa2309915
19. Genetic Engineering & Biotechnology News. 2022-11. "Editas Medicine pauses trial of CRISPR-Cas9 treatment for blindness disorder." (secondary) https://www.genengnews.com/news/editas-medicine-pauses-trial-of-crispr-cas9-treatment-for-blindness-disorder/
20. Gillmore JD, Gane E, Taubel J, et al. 2021. "CRISPR-Cas9 In Vivo Gene Editing for Transthyretin Amyloidosis." *New England Journal of Medicine* 385:493–502. doi:10.1056/NEJMoa2107454
21. Fontana M, Solomon SD, Kachadourian J, et al. 2024. "CRISPR-Cas9 Gene Editing with Nexiguran Ziclumeran for ATTR Cardiomyopathy." *New England Journal of Medicine* 391:2231–2241. doi:10.1056/NEJMoa2412309
22. BioSpace. 2025-11. "Patient dies after receiving Intellia's CRISPR gene therapy candidate." (secondary) https://www.biospace.com/drug-development/patient-dies-after-receiving-intellias-crispr-gene-therapy-candidate
    - 22a. Intellia two-year ATTRv-PN Phase 1 data, as reported in company releases summarised by BioSpace (company data, not peer-reviewed at two years).
23. Intellia Therapeutics. 2026-01-27. "Intellia Therapeutics announces FDA lift of clinical hold on MAGNITUDE-2 Phase 3 clinical trial in ATTRv-PN." https://www.biospace.com/press-releases/intellia-therapeutics-announces-fda-lift-of-clinical-hold-on-magnitude-2-phase-3-clinical-trial-in-attrv-pn
24. Intellia Therapeutics. 2026-03. Form 8-K Exhibit 99.1 (MAGNITUDE clinical hold lift). https://www.sec.gov/Archives/edgar/data/1652130/000119312526073456/ntla-ex99_1.htm
25. Precision Medicine Online. 2026-03. "FDA lifts clinical hold on Intellia's CRISPR-based ATTR-CM treatment." (secondary) https://www.precisionmedicineonline.com/regulatory-news-fda-approvals/fda-lifts-clinical-hold-intellias-crispr-based-attr-cm-treatment
26. Intellia Therapeutics. 2026-08-06. Form 8-K Exhibit 99.1, "Second Quarter 2026 Financial Results and Business Updates." https://www.sec.gov/Archives/edgar/data/1652130/000119312526336772/ntla-ex99_1.htm
27. Musunuru K, Grandinette SA, Wang X, et al. (Ahrens-Nicklas RC, senior author). 2025. "Patient-Specific In Vivo Gene Editing to Treat a Rare Genetic Disease." *New England Journal of Medicine* 392:2235–2243. doi:10.1056/NEJMoa2504747
28. Children's Hospital of Philadelphia. 2025-05-15. "World's first patient treated with personalized CRISPR gene editing therapy." https://chop.edu/news/worlds-first-patient-treated-personalized-crispr-gene-editing-therapy-childrens-hospital
29. Prime Medicine. 2025-12. "Prime Medicine announces New England Journal of Medicine publication of PM359 data" ("Prime Editing for p47-phox Chronic Granulomatous Disease"; DOI not verified). https://investors.primemedicine.com/news-releases/news-release-details/prime-medicine-announces-new-england-journal-medicine
30. Our World in Data. "Life expectancy at birth (period)," based on UN WPP 2024 and Riley/Zijdeman long-run estimates. Snapshot fetched 2026-08-10 (repository `app/public/data/life-expectancy.json`). https://ourworldindata.org/life-expectancy

### Longevity escape velocity and SENS

31. de Grey ADNJ. 2004. "Escape Velocity: Why the Prospect of Extreme Human Life Extension Matters Now." *PLoS Biology* 2(6):e187. doi:10.1371/journal.pbio.0020187
32. de Grey ADNJ, Ames BN, Andersen JK, et al. 2002. "Time to Talk SENS: Critiquing the Immutability of Human Aging." *Annals of the New York Academy of Sciences* 959:452–462. doi:10.1111/j.1749-6632.2002.tb02115.x

### Life-expectancy trends, forecasts and COVID-19

33. Oeppen J, Vaupel JW. 2002. "Broken Limits to Life Expectancy." *Science* 296:1029–1031. doi:10.1126/science.1069675
34. Vaupel JW, Villavicencio F, Bergeron-Boucher MP. 2021. "Demographic perspectives on the rise of longevity." *Proceedings of the National Academy of Sciences* 118(9):e2019536118. doi:10.1073/pnas.2019536118
35. Olshansky SJ, Willcox BJ, Demetrius L, Beltrán-Sánchez H. 2024. "Implausibility of radical life extension in humans in the twenty-first century." *Nature Aging* 4:1635–1642. doi:10.1038/s43587-024-00702-3
36. Jdanov DA, Jasilionis D. 2024. "Optimistic versus pessimistic scenarios for future life expectancy" (News & Views). *Nature Aging*. doi:10.1038/s43587-024-00722-z
37. Warner H, Anderson J, Austad S, et al. 2005. "Science fact and the SENS agenda." *EMBO Reports* 6:1006–1008. doi:10.1038/sj.embor.7400555
38. Olshansky SJ, Carnes BA, Cassel C. 1990. "In Search of Methuselah: Estimating the Upper Limits to Human Longevity." *Science* 250:634–640. doi:10.1126/science.2237414
39. Vaupel JW. 2010. "Biodemography of human ageing." *Nature* 464:536–542. doi:10.1038/nature08984
40. GBD 2021 Forecasting Collaborators (Vollset SE, et al.). 2024. "Burden of disease scenarios for 204 countries and territories, 2022–2050: a forecasting analysis for the Global Burden of Disease Study 2021." *The Lancet* 403:2204–2256. doi:10.1016/S0140-6736(24)00685-8
41. GBD 2023 Demographics Collaborators. 2025. "Global age-sex-specific all-cause mortality and life expectancy estimates for 204 countries and territories and 660 subnational locations, 1950–2023: a demographic analysis for the Global Burden of Disease Study 2023." *The Lancet* 406:1731–1810. doi:10.1016/S0140-6736(25)01330-3
42. United Nations, Department of Economic and Social Affairs, Population Division. 2024-07-11. "World Population Prospects 2024" (press release). https://www.un.org/sustainabledevelopment/blog/2024/07/press-release-wpp2024/
43. GBD 2021 Demographics Collaborators (Schumacher AE, et al.). 2024. "Global age-sex-specific mortality, life expectancy, and population estimates in 204 countries and territories and 811 subnational locations, 1950–2021, and the impact of the COVID-19 pandemic." *The Lancet* 403:1989–2056. doi:10.1016/S0140-6736(24)00476-8

### Drivers of historical mortality decline

44. Preston SH. 1975. "The changing relation between mortality and level of economic development." *Population Studies* 29(2):231–248. doi:10.1080/00324728.1975.10410201
45. Cutler D, Deaton A, Lleras-Muney A. 2006. "The Determinants of Mortality." *Journal of Economic Perspectives* 20(3):97–120. doi:10.1257/jep.20.3.97
46. Cutler D, Miller G. 2005. "The role of public health improvements in health advances: the twentieth-century United States." *Demography* 42(1):1–22. doi:10.1353/dem.2005.0002
47. Omran AR. 2005 (reprint of 1971). "The Epidemiologic Transition: A Theory of the Epidemiology of Population Change." *Milbank Quarterly* 83(4):731–757. doi:10.1111/j.1468-0009.2005.00398.x
48. Acemoglu D, Johnson S. 2007. "Disease and Development: The Effect of Life Expectancy on Economic Growth." *Journal of Political Economy* 115(6):925–985. doi:10.1086/529000
49. Babiarz KS, Eggleston K, Miller G, Zhang Q. 2015. "An exploration of China's mortality decline under Mao: A provincial analysis, 1950–80." *Population Studies* 69(1):39–56. doi:10.1080/00324728.2014.972432
50. Szreter S. 1988. "The Importance of Social Intervention in Britain's Mortality Decline c.1850–1914: a Re-interpretation of the Role of Public Health." *Social History of Medicine* 1(1):1–38. doi:10.1093/shm/1.1.1
51. Lutz W, Kebede E. 2018. "Education and Health: Redrawing the Preston Curve." *Population and Development Review* 44(2):343–361. doi:10.1111/padr.12141
52. Riley JC. 2001. *Rising Life Expectancy: A Global History.* Cambridge University Press. ISBN 978-0521002813.
53. Kannisto V, Lauritsen J, Thatcher AR, Vaupel JW. 1994. "Reductions in Mortality at Advanced Ages: Several Decades of Evidence from 27 Countries." *Population and Development Review* 20(4):793–810. doi:10.2307/2137662

### Recent slowdowns and stalls

54. Ho JY, Hendi AS. 2018. "Recent trends in life expectancy across high income countries: retrospective observational study." *BMJ* 362:k2562. doi:10.1136/bmj.k2562
55. Mehta NK, Abrams LR, Myrskylä M. 2020. "US life expectancy stalls due to cardiovascular disease, not drug deaths." *PNAS* 117(13):6998–7000. doi:10.1073/pnas.1920391117
56. Woolf SH, Schoomaker H. 2019. "Life Expectancy and Mortality Rates in the United States, 1959–2017." *JAMA* 322(20):1996–2016. doi:10.1001/jama.2019.16932
57. Leon DA, Jdanov DA, Shkolnikov VM. 2019. "Trends in life expectancy and age-specific mortality in England and Wales, 1970–2016, in comparison with a set of 22 high-income countries: an analysis of vital statistics data." *Lancet Public Health* 4(11):e575–e582. doi:10.1016/S2468-2667(19)30177-X
58. Schöley J, Aburto JM, Kashnitsky I, et al. 2022. "Life expectancy changes since COVID-19." *Nature Human Behaviour* 6:1649–1659. doi:10.1038/s41562-022-01450-3
59. Aburto JM, Schöley J, Kashnitsky I, et al. 2022. "Quantifying impacts of the COVID-19 pandemic through life-expectancy losses: a population-level study of 29 countries." *International Journal of Epidemiology* 51(1):63–74. doi:10.1093/ije/dyab207
60. Msemburi W, Karlinsky A, Knutson V, et al. 2023. "The WHO estimates of excess mortality associated with the COVID-19 pandemic." *Nature* 613:130–137. doi:10.1038/s41586-022-05522-2

### Maximum lifespan and the late-life mortality plateau

61. Dong X, Milholland B, Vijg J. 2016. "Evidence for a limit to human lifespan." *Nature* 538:257–259. doi:10.1038/nature19793
62. Lenart A, Vaupel JW. 2017. "Questionable evidence for a limit to human lifespan." *Nature* 546:E13–E14. doi:10.1038/nature22790
63. Brown NJL, Albers CJ, Ritchie SJ. 2017. "Contesting the evidence for limited human lifespan." *Nature* 546:E6–E7. doi:10.1038/nature22784
64. Hughes BG, Hekimi S. 2017. "Many possible maximum lifespan trajectories." *Nature* 546:E8–E9. doi:10.1038/nature22786
65. Rozing MP, Kirkwood TBL, Westendorp RGJ. 2017. "Is there evidence for a limit to human lifespan?" *Nature* 546:E11–E12. doi:10.1038/nature22788
66. de Beer J, Bardoutsos A, Janssen F. 2017. "Maximum human lifespan may increase to 125 years." *Nature* 546:E16–E17. doi:10.1038/nature22792
67. Rootzén H, Zholud D. 2017. "Human life is unlimited – but short." *Extremes* 20:713–728. doi:10.1007/s10687-017-0305-5
68. Pearce M, Raftery AE. 2021. "Probabilistic forecasting of maximum human lifespan by 2100 using Bayesian population projections." *Demographic Research* 44:1271–1294. doi:10.4054/DemRes.2021.44.52
69. Barbi E, Lagona F, Marsili M, Vaupel JW, Wachter KW. 2018. "The plateau of human mortality: Demography of longevity pioneers." *Science* 360:1459–1461. doi:10.1126/science.aat3119
70. Newman SJ. 2018. "Errors as a primary cause of late-life mortality deceleration and plateaus." *PLoS Biology* 16(12):e2006776. doi:10.1371/journal.pbio.2006776
71. Beltrán-Sánchez H, Austad SN, Finch CE. 2018. "Comment on 'The plateau of human mortality: Demography of longevity pioneers'." *Science* 361:eaav1200. doi:10.1126/science.aav1200
72. Gavrilov LA, Gavrilova NS. 2019. "Late-life mortality is underestimated because of data errors." *PLoS Biology* 17(2):e3000148. doi:10.1371/journal.pbio.3000148
73. Alvarez JA, Villavicencio F, Strozza C, Camarda CG. 2021. "Regularities in human mortality after age 105." *PLoS ONE* 16(7):e0253940. doi:10.1371/journal.pone.0253940

### Aging interventions: senolytics

74. Farr JN, Atkinson EJ, Achenbach SJ, et al. 2024. "Effects of intermittent senolytic therapy on bone metabolism in postmenopausal women: a phase 2 randomized controlled trial." *Nature Medicine* 30:2605–2612. doi:10.1038/s41591-024-03096-2
75. Unity Biotechnology. UBX0101 Phase 2 knee-osteoarthritis results (announced August 2020); conference abstract in *Osteoarthritis and Cartilage* 2021. doi:10.1016/j.joca.2021.02.077
76. Unity Biotechnology. 2025-06-27. Form 8-K (board approval of plan of dissolution). https://www.sec.gov/Archives/edgar/data/1463361/000095017025091210/ubx-20250627.htm
77. Hickson LJ, Langhi Prata LGP, Bobart SA, et al. 2019. "Senolytics decrease senescent cells in humans: Preliminary report from a clinical trial of Dasatinib plus Quercetin in individuals with diabetic kidney disease." *EBioMedicine* 47:446–456. doi:10.1016/j.ebiom.2019.08.069
78. Justice JN, Nambiar AM, Tchkonia T, et al. 2019. "Senolytics in idiopathic pulmonary fibrosis: Results from a first-in-human, open-label, pilot study." *EBioMedicine* 40:554–563. doi:10.1016/j.ebiom.2018.12.052
79. Gonzales MM, Garbarino VR, Kautz TF, et al. 2023. "Senolytic therapy in mild Alzheimer's disease: a phase 1 feasibility trial." *Nature Medicine* 29:2481–2488. doi:10.1038/s41591-023-02543-w

### Aging interventions: LEV forecasts and partial reprogramming

80. Kurzweil R. 2024. *The Singularity Is Nearer: When We Merge with AI.* Viking. ISBN 978-0399562761. (Source of the 2029–2035 LEV prediction; a book, not peer-reviewed.)
81. Ocampo A, Reddy P, Martinez-Redondo P, et al. 2016. "In Vivo Amelioration of Age-Associated Hallmarks by Partial Reprogramming." *Cell* 167:1719–1733. doi:10.1016/j.cell.2016.11.052
82. Lu Y, Brommer B, Tian X, et al. 2020. "Reprogramming to recover youthful epigenetic information and restore vision." *Nature* 588:124–129. doi:10.1038/s41586-020-2975-4
83. Life Biosciences. 2026-06-09. "Life Biosciences announces first patient dosed in Phase 1 trial of ER-100 for optic neuropathies." https://www.globenewswire.com/news-release/2026/06/09/3308634/0/en/life-biosciences-announces-first-patient-dosed-in-phase-1-trial-of-er-100-for-optic-neuropathies.html
84. Life Biosciences. 2026-10-08. "Life Biosciences announces first-in-human data from ongoing Phase 1 trial evaluating ER-100 in optic neuropathies." https://www.lifebiosciences.com/life-biosciences-announces-first-in-human-data-from-ongoing-phase-1-trial-evaluating-er-100-in-optic-neuropathies/

### Aging interventions: rapamycin and metformin

85. Mannick JB, Del Giudice G, Lattanzi M, et al. 2014. "mTOR inhibition improves immune function in the elderly." *Science Translational Medicine* 6:268ra179. doi:10.1126/scitranslmed.3009892
86. Mannick JB, Teo G, Bernardo P, et al. 2021. "Targeting the biology of ageing with mTOR inhibitors to improve immune function in older adults: phase 2b and phase 3 randomised trials." *Lancet Healthy Longevity* 2(5):e250–e262. doi:10.1016/S2666-7568(21)00062-3
87. Moel M, Harinath G, Lee V, et al. 2025. "Influence of rapamycin on safety and healthspan metrics after one year: PEARL trial results." *Aging (Albany NY)* 17. doi:10.18632/aging.206235
88. Barzilai N, Crandall JP, Kritchevsky SB, Espeland MA. 2016. "Metformin as a Tool to Target Aging." *Cell Metabolism* 23(6):1060–1065. doi:10.1016/j.cmet.2016.05.011
89. WAMC / NPR. 2024-04-22. "A cheap drug may slow down aging. A study will determine if it works." (secondary; TAME funding status) https://www.wamc.org/2024-04-22/a-cheap-drug-may-slow-down-aging-a-study-will-determine-if-it-works
90. Bannister CA, Holden SE, Jenkins-Jones S, et al. 2014. "Can people with type 2 diabetes live longer than those without? A comparison of mortality in people initiated with metformin or sulphonylurea monotherapy and matched, non-diabetic controls." *Diabetes, Obesity and Metabolism* 16(11):1165–1173. doi:10.1111/dom.12354
91. Keys MT, Thinggaard M, Larsen LA, et al. 2022. "Reassessing the evidence of a survival advantage in Type 2 diabetes treated with metformin compared with controls without diabetes: a retrospective cohort study." *International Journal of Epidemiology* 51(6):1886–1898. doi:10.1093/ije/dyac200
92. Konopka AR, Laurin JL, Schoenberg HM, et al. 2019. "Metformin inhibits mitochondrial adaptations to aerobic exercise training in older adults." *Aging Cell* 18(1):e12880. doi:10.1111/acel.12880
93. Walton RG, Dungan CM, Long DE, et al. 2019. "Metformin blunts muscle hypertrophy in response to progressive resistance exercise training in older adults: A randomized, double-blind, placebo-controlled, multicenter trial: The MASTERS trial." *Aging Cell* 18(6):e13039. doi:10.1111/acel.13039

### Aging interventions: GLP-1 receptor agonists

94. Lincoff AM, Brown-Frandsen K, Colhoun HM, et al. 2023. "Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes." *New England Journal of Medicine* 389:2221–2232. doi:10.1056/NEJMoa2307563
95. Perkovic V, Tuttle KR, Rossing P, et al. 2024. "Effects of Semaglutide on Chronic Kidney Disease in Patients with Type 2 Diabetes." *New England Journal of Medicine* 391:109–121. doi:10.1056/NEJMoa2403347
96. Sattar N, Lee MMY, Kristensen SL, et al. 2021. "Cardiovascular, mortality, and kidney outcomes with GLP-1 receptor agonists in patients with type 2 diabetes: a systematic review and meta-analysis of randomised trials." *Lancet Diabetes & Endocrinology* 9(10):653–662. doi:10.1016/S2213-8587(21)00203-5

### Biomarkers of aging and frameworks

97. Horvath S. 2013. "DNA methylation age of human tissues and cell types." *Genome Biology* 14:R115. doi:10.1186/gb-2013-14-10-r115
98. Hannum G, Guinney J, Zhao L, et al. 2013. "Genome-wide methylation profiles reveal quantitative views of human aging rates." *Molecular Cell* 49(2):359–367. doi:10.1016/j.molcel.2012.10.016
99. Levine ME, Lu AT, Quach A, et al. 2018. "An epigenetic biomarker of aging for lifespan and healthspan." *Aging (Albany NY)* 10(4):573–591. doi:10.18632/aging.101414
100. Lu AT, Quach A, Wilson JG, et al. 2019. "DNA methylation GrimAge strongly predicts lifespan and healthspan." *Aging (Albany NY)* 11(2):303–327. doi:10.18632/aging.101684
101. Belsky DW, Caspi A, Corcoran DL, et al. 2022. "DunedinPACE, a DNA methylation biomarker of the pace of aging." *eLife* 11:e73420. doi:10.7554/eLife.73420
102. Higgins-Chen AT, Thrush KL, Wang Y, et al. 2022. "A computational solution for bolstering reliability of epigenetic clocks: implications for clinical trials and longitudinal tracking." *Nature Aging* 2:644–661. doi:10.1038/s43587-022-00248-2
103. Moqri M, Herzog C, Poganik JR, et al. (Biomarkers of Aging Consortium). 2023. "Biomarkers of aging for the identification and evaluation of longevity interventions." *Cell* 186(18):3758–3775. doi:10.1016/j.cell.2023.08.003
104. Moqri M, Herzog C, Poganik JR, et al. 2024. "Validation of biomarkers of aging." *Nature Medicine* 30:360–372. doi:10.1038/s41591-023-02784-9
105. Waziry R, Ryan CP, Corcoran DL, et al. 2023. "Effect of long-term caloric restriction on DNA methylation measures of biological aging in healthy adults from the CALERIE trial." *Nature Aging* 3:248–257. doi:10.1038/s43587-022-00357-y
106. López-Otín C, Blasco MA, Partridge L, Serrano M, Kroemer G. 2023. "Hallmarks of aging: An expanding universe." *Cell* 186(2):243–278. doi:10.1016/j.cell.2022.11.001
107. Pyrkov TV, Avchaciov K, Tarkhov AE, et al. 2021. "Longitudinal analysis of blood markers reveals progressive loss of resilience and predicts human lifespan limit." *Nature Communications* 12:2765. doi:10.1038/s41467-021-23014-1 (single-group, unreplicated claim of a 120–150-year resilience limit; included for completeness, labelled **Unconfirmed-single-study**)
108. Olshansky SJ, Passaro DJ, Hershow RC, et al. 2005. "A Potential Decline in Life Expectancy in the United States in the 21st Century." *New England Journal of Medicine* 352:1138–1145. doi:10.1056/NEJMsr043743
