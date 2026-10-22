# CRISPR-Based Autologous Gene Therapy: Editing a Patient’s Own Cells

**Published:** May 1, 2025  
**Re-verified:** October 22, 2026 (issue [#7](https://github.com/konard/immortality/issues/7))  
**Format:** Markdown (for GitHub)

> **Corrections (October 2026).** This document was re-checked against regulator notices,
> ClinicalTrials.gov records, peer-reviewed trial reports and company SEC filings. The
> evidence, with a verdict for every claim, is in
> [docs/case-studies/issue-7/science-verification.md](docs/case-studies/issue-7/science-verification.md).
> The main changes:
> - Casgevy does **not** insert a corrected DNA template. It disrupts the *BCL11A* erythroid
>   enhancer with a single Cas9 cut.
> - No virus is involved, so “infect” was wrong.
> - The ClinicalTrials.gov number was mislabelled.
> - The EDIT-101 method and status were corrected, and the NTLA-2001 status was updated
>   (Phase 3 clinical hold, then lifted).
> - The UK figures were split into the two separate NICE decisions.

---

## Introduction

CRISPR–Cas9 and its derivative technologies (base editors, prime editors) have ushered in a
new era of precision gene therapy.

In the **ex vivo** approach:
- A patient’s own blood stem cells are collected and edited outside the body.
- The cells are reinfused after chemotherapy conditioning.

The first approved CRISPR medicine, **Casgevy**, does not insert a corrected gene. It uses a
single Cas9 cut to switch off the *BCL11A* erythroid enhancer, so red cells make fetal
haemoglobin again [6, 7, 8].

**In vivo** approaches instead deliver the editor directly into the body, for example by
lipid nanoparticles to the liver [20, 21].

---

## Mechanism of Action

1. **Targeted DNA Break**  
   - A guide RNA directs Cas9 (or a Cas variant) to a specific genomic locus, where it makes
     a double-strand break.
   - Cells repair this via non-homologous end joining (NHEJ) or homology-directed repair
     (HDR).

2. **Homology-Directed Repair (HDR)**  
   - When a donor DNA template with homology arms is provided, the cell’s repair machinery
     copies in the corrected sequence at the break site.

3. **Base & Prime Editing**  
   - **Base editors** convert single bases (e.g. A→G or C→T) without double-strand breaks.
   - **Prime editors** nick one DNA strand and reverse-transcribe the edit from an extended
     guide RNA (pegRNA), avoiding double-strand breaks.

In the clinic, most approved or late-stage CRISPR therapies use **NHEJ gene disruption**
rather than HDR correction: Casgevy, EDIT-101 and NTLA-2001 all work without a donor
template [6, 18, 20].

Two newer approaches have each been reported in only one or two patients. Neither has been
replicated yet.
- **In vivo base editing:** a personalised base editor was given to one infant with CPS1
  deficiency in 2025 [27, 28].
- **Prime editing:** the first patient data came in 2025, from two patients with p47phox
  chronic granulomatous disease [29].

[Learn more about HDR, base editing, and prime editing](https://en.wikipedia.org/wiki/Prime_editing).

---

## Delivery Approaches

| Approach | Description | Examples |
|----------|-------------|----------|
| **Ex vivo** | Harvest patient cells (e.g. hematopoietic stem cells) and edit them in culture. For Casgevy this means electroporation of Cas9–guide RNA complexes; some other products use viral vectors. Then reinfuse after conditioning. | CTX001/Casgevy for sickle cell & β-thalassemia |
| **In vivo** | Direct delivery of editors into the body, e.g. intravenous lipid nanoparticles (NTLA-2001) or subretinal AAV injection (EDIT-101). | EDIT-101 (retina) • NTLA-2001 (liver) |

---

## Clinical Implementations

### Ex vivo Therapy: CTX001 / Casgevy  
- **Active Ingredient:** Exagamglogene autotemcel (exa-cel, CTX001; brand name **Casgevy**;
  Vertex / CRISPR Therapeutics)
- **Indications:**  
  - Sickle cell disease (SCD) with recurrent vaso-occlusive crises  
  - Transfusion-dependent β-thalassemia (TDT)  
- **Mechanism:**
  - CRISPR–Cas9 cuts a GATA1 binding site in the erythroid-specific enhancer of *BCL11A*.
  - The cut is repaired by NHEJ, which reactivates fetal hemoglobin (HbF).
  - The disease-causing *HBB* mutation itself is not corrected [6, 7, 8].
- **Approval & Rollout:**  
  - **MHRA (UK):** conditional authorisation 16 November 2023 (world first; ages 12+) [2]
  - **FDA (US):**
    - SCD approved 8 December 2023, the same day as bluebird bio’s lentiviral Lyfgenia [1]
    - TDT approved 16 January 2024 [5]
    - Label expanded to patients aged 2 years and older in July 2026 [11, 12]
  - **EU:** conditional marketing authorisation 9 February 2024 [3]
  - **Worldwide:** approved in 39 countries by mid-2026 [11]
- **Pivotal trials:**
  - CLIMB-121 (SCD, [NCT03745287](https://clinicaltrials.gov/study/NCT03745287))
  - CLIMB-111 (TDT, [NCT03655678](https://clinicaltrials.gov/study/NCT03655678))
  - The results were published in NEJM in 2024 [7, 8].
- **Paediatric trials:** CLIMB-151 ([NCT05329649](https://clinicaltrials.gov/study/NCT05329649))
  and CLIMB-141 ([NCT05356195](https://clinicaltrials.gov/study/NCT05356195)) supported the
  2026 label expansion [13].

### In vivo Therapy: EDIT-101  
- **Indication:** Leber congenital amaurosis 10 (LCA10, *CEP290* IVS26 mutation)
- **Method:**
  - An AAV5 vector carries SaCas9 and two guide RNAs, given by subretinal injection.
  - The guides cut out the IVS26 splice mutation.
  - There is no donor template [18].
- **Status:**
  - Phase 1/2 BRILLIANCE trial ([NCT03872479](https://clinicaltrials.gov/study/NCT03872479)).
  - Results in 14 participants were published in NEJM in 2024 (Pierce et al.): safety was
    acceptable, and only a minority improved [18].
  - Editas paused the programme in November 2022 to seek a partner [19].
  - No further development has been announced.

### In vivo Therapy: NTLA-2001 (nexiguran ziclumeran, “nex-z”; Intellia/Regeneron)
- **Indication:** Transthyretin (ATTR) amyloidosis, in two forms:
  - hereditary polyneuropathy (ATTRv-PN)
  - cardiomyopathy (ATTR-CM), hereditary or wild-type [20, 21]
- **Method:**
  - Lipid nanoparticles deliver Cas9 mRNA and a guide RNA to the liver.
  - *TTR* is knocked out via NHEJ, with no donor template.
- **Key Data:**
  - The Phase 1 trial ([NCT04601051](https://clinicaltrials.gov/study/NCT04601051)) had
    72 participants.
  - A single infusion lowered serum TTR by about 90% on average [20, 21].
  - The reduction was sustained for at least 1–2 years [21, 22a].
  - Clinical-outcome benefit is not yet proven.
- **Status:**
  - Two Phase 3 trials: MAGNITUDE (ATTR-CM,
    [NCT06128629](https://clinicaltrials.gov/study/NCT06128629)) and MAGNITUDE-2 (ATTRv-PN,
    [NCT06672237](https://clinicaltrials.gov/study/NCT06672237)).
  - In October 2025 the FDA placed both on clinical hold after a Grade 4 liver-injury event.
    The patient later died [22].
  - The holds were lifted with added liver monitoring: MAGNITUDE-2 in January 2026 and
    MAGNITUDE in March 2026 [23, 24, 25].
  - Enrollment has resumed [26].

**No in vivo CRISPR therapy is approved yet (October 2026).** Intellia’s lonvo-z (NTLA-2002,
hereditary angioedema) reported positive Phase 3 data. Intellia expects a US launch in 2027,
if the drug is approved [26].

---

## Practical Usage in Patients

- **CTX001/Casgevy** is **commercially available** in 39 countries by mid-2026, including the
  US, UK, EU, Canada, Switzerland and Gulf states [11].
  - It is given at authorised treatment centres; there were more than 75 by mid-2025 [9].
  - It requires myeloablative busulfan conditioning (chemotherapy) before reinfusion. This
    is the main toxicity and a key barrier to uptake [7, 8].
  - Patients typically remain hospitalized for several weeks. Neutrophil engraftment took a
    median of about 4 weeks in the pivotal trials [7, 8].
  - Uptake is still small relative to need:
    - 64 patients were infused worldwide in 2025, against an estimated more than 60,000
      eligible patients [10].
    - Infusions accelerated in 2026 [11].

- **EDIT-101** and **NTLA-2001** are **not approved**.
  - EDIT-101 is paused.
  - NTLA-2001 is in Phase 3 trials at specialised centres.

---

## Cost of Therapy

### United States  
- **Casgevy list price:** \$2.2 million USD per one-time treatment [17]. For comparison,
  Lyfgenia, approved the same day, lists at \$3.1 million [16].
- **Payment models:** the following were not individually verified:
  - Specialty pharmacy hubs  
  - Outcomes-based agreements  
  - Installment plans with pay-for-performance clauses  

> Source: [BioPharma Dive](https://www.biopharmadive.com/news/crispr-sickle-cell-price-millions-gene-therapy-vertex/702066/)

### United Kingdom (England)
- **Transfusion-dependent β-thalassemia** [14]:
  - NICE recommended it in August 2024 via the Innovative Medicines Fund.
  - The list price is £1.65 million per patient, with a confidential discount.
  - About 460 patients aged 12+ in England are eligible.
  - Treatment is given at seven NHS specialist centres.
- **Sickle cell disease** [15]:
  - NICE initially rejected it (March 2024).
  - NICE then recommended it in January 2025 under a managed-access agreement, at the same
    list price with a confidential discount.
  - About 50 patients a year are expected to be treated initially.

> Sources: [NHS England, Aug 2024](https://www.england.nhs.uk/2024/08/gene-editing-therapy-that-could-cure-blood-disorder-thalassaemia-for-nhs-patients/); [Pharmaceutical Technology, Jan 2025](https://www.pharmaceutical-technology.com/news/nhs-england-to-offer-casgevy-for-sickle-cell-disease-patients/)

---

## Future Directions

1. **Improving HDR efficiency** in non-dividing cells  
2. **Next-gen editors** (base and prime editors) with reduced off-target activity  
3. **Non-viral delivery platforms** (LNPs, nanoparticles) to broaden tissue targeting. LNP
   delivery to the liver is already in Phase 3 [20, 21, 26]; other tissues remain the
   challenge.
4. **Gentler conditioning** than busulfan, so that ex vivo therapies become less toxic
5. **Cost reduction** through manufacturing scale-up and platform optimization  

---

## Conclusion

CRISPR-based therapies are a real clinical advance for some single-gene diseases.
**Casgevy** (US list price \$2.2 million) is approved in dozens of countries, and in vivo
editors delivered by lipid nanoparticles are in Phase 3.

They also have clear limits:
- They remain expensive and demanding: Casgevy requires chemotherapy conditioning.
- Uptake is still small.
- Serious adverse events have occurred in trials.
- None of these therapies targets aging itself.

Treatment with one’s own edited cells is now a reality, but it is a therapy for specific
diseases, not a route to immortality.

---

## References

1. FDA, 2023-12-08. “FDA Approves First Gene Therapies to Treat Patients with Sickle Cell Disease.”  
   <https://www.fda.gov/news-events/press-announcements/fda-approves-first-gene-therapies-treat-patients-sickle-cell-disease>
2. MHRA, 2023-11-16. “MHRA authorises world-first gene therapy that aims to cure sickle-cell disease and transfusion-dependent β-thalassemia.”  
   <https://www.gov.uk/government/news/mhra-authorises-world-first-gene-therapy-that-aims-to-cure-sickle-cell-disease-and-transfusion-dependent-thalassemia>
3. EMA. Casgevy (exagamglogene autotemcel) EPAR; conditional marketing authorisation 2024-02-09.  
   <https://www.ema.europa.eu/en/medicines/human/EPAR/casgevy>
4. Paul-Ehrlich-Institut, 2023-12-22. “Authorisation recommendation for gene-editing medicine.”  
   <https://www.pei.de/EN/newsroom/hp-news/2023/231222-authorisation-reommendation-gene-editing-medicine.html>
5. BioSpace, 2024-01. “FDA approves Vertex, CRISPR’s Casgevy to treat beta thalassemia.” (secondary)  
   <https://www.biospace.com/fda-approves-vertex-crispr-s-casgevy-to-treat-beta-thalassemia>
6. Frangoul H, et al. 2021. “CRISPR-Cas9 Gene Editing for Sickle Cell Disease and β-Thalassemia.” *NEJM* 384:252–260. doi:10.1056/NEJMoa2031054
7. Frangoul H, et al. 2024. “Exagamglogene Autotemcel for Severe Sickle Cell Disease.” *NEJM* 390:1649–1662. doi:10.1056/NEJMoa2309676
8. Locatelli F, et al. 2024. “Exagamglogene Autotemcel for Transfusion-Dependent β-Thalassemia.” *NEJM* 390:1663–1676. doi:10.1056/NEJMoa2309673
9. Vertex Pharmaceuticals, 2025-08. Form 8-K Exhibit 99.1, Q2 2025 results.  
   <https://www.sec.gov/Archives/edgar/data/0000875320/000087532025000213/ex-991_q22025.htm>
10. Vertex Pharmaceuticals, 2026-02. Form 8-K Exhibit 99.1, Q4 and full-year 2025 results.  
    <https://www.sec.gov/Archives/edgar/data/875320/000087532026000034/ex-991_q42025.htm>
11. Vertex Pharmaceuticals, 2026-08. Form 8-K Exhibit 99.1, Q2 2026 results.  
    <https://www.sec.gov/Archives/edgar/data/875320/000087532026000256/ex-991_q22026.htm>
12. Healio, 2026-07-02. “FDA expands Casgevy approval to children 2 years and older with sickle cell disease.” (secondary)  
    <https://www.healio.com/news/hematology-oncology/20260702/fda-expands-casgevy-approval-to-children-2-years-and-older-with-sickle-cell-disease>
13. ClinicalTrials.gov records (API v2, October 2026): NCT05329649 (CLIMB-151), NCT03655678 (CLIMB-111), NCT03745287 (CLIMB-121), NCT05356195 (CLIMB-141), NCT03872479 (EDIT-101), NCT04601051 (NTLA-2001 Phase 1), NCT06128629 (MAGNITUDE), NCT06672237 (MAGNITUDE-2).  
    <https://clinicaltrials.gov/study/NCT03745287>
14. NHS England, 2024-08. “Gene-editing therapy that could cure blood disorder thalassaemia for NHS patients.”  
    <https://www.england.nhs.uk/2024/08/gene-editing-therapy-that-could-cure-blood-disorder-thalassaemia-for-nhs-patients/>
15. Pharmaceutical Technology, 2025-01. “NHS England to offer Casgevy for sickle cell disease patients.” (secondary)  
    <https://www.pharmaceutical-technology.com/news/nhs-england-to-offer-casgevy-for-sickle-cell-disease-patients/>
16. PharmaLive, 2023-12. “Bluebird’s newly approved SCD gene therapy faces rough road with hefty price tag, boxed warning.” (secondary)  
    <https://www.pharmalive.com/bluebirds-newly-approved-scd-gene-therapy-faces-rough-road-with-hefty-price-tag-boxed-warning/>
17. BioPharma Dive, 2023-12. “Pricey new gene therapies for sickle cell pose access test.”  
    <https://www.biopharmadive.com/news/crispr-sickle-cell-price-millions-gene-therapy-vertex/702066/>
18. Pierce EA, et al. 2024. “Gene Editing for CEP290-Associated Retinal Degeneration.” *NEJM* 390:1972–1984. doi:10.1056/NEJMoa2309915
19. GEN, 2022-11. “Editas Medicine pauses trial of CRISPR-Cas9 treatment for blindness disorder.” (secondary)  
    <https://www.genengnews.com/news/editas-medicine-pauses-trial-of-crispr-cas9-treatment-for-blindness-disorder/>
20. Gillmore JD, et al. 2021. “CRISPR-Cas9 In Vivo Gene Editing for Transthyretin Amyloidosis.” *NEJM* 385:493–502. doi:10.1056/NEJMoa2107454
21. Fontana M, et al. 2024. “CRISPR-Cas9 Gene Editing with Nexiguran Ziclumeran for ATTR Cardiomyopathy.” *NEJM* 391:2231–2241. doi:10.1056/NEJMoa2412309
22. BioSpace, 2025-11. “Patient dies after receiving Intellia’s CRISPR gene therapy candidate.” (secondary)  
    <https://www.biospace.com/drug-development/patient-dies-after-receiving-intellias-crispr-gene-therapy-candidate>  
    22a. Intellia two-year ATTRv-PN Phase 1 data (company data, not peer-reviewed at two years).
23. Intellia Therapeutics, 2026-01-27. “FDA lift of clinical hold on MAGNITUDE-2 Phase 3 clinical trial in ATTRv-PN.”  
    <https://www.biospace.com/press-releases/intellia-therapeutics-announces-fda-lift-of-clinical-hold-on-magnitude-2-phase-3-clinical-trial-in-attrv-pn>
24. Intellia Therapeutics, 2026-03. Form 8-K Exhibit 99.1 (MAGNITUDE clinical hold lift).  
    <https://www.sec.gov/Archives/edgar/data/1652130/000119312526073456/ntla-ex99_1.htm>
25. Precision Medicine Online, 2026-03. “FDA lifts clinical hold on Intellia’s CRISPR-based ATTR-CM treatment.” (secondary)  
    <https://www.precisionmedicineonline.com/regulatory-news-fda-approvals/fda-lifts-clinical-hold-intellias-crispr-based-attr-cm-treatment>
26. Intellia Therapeutics, 2026-08-06. Form 8-K Exhibit 99.1, Q2 2026 results and business updates.  
    <https://www.sec.gov/Archives/edgar/data/1652130/000119312526336772/ntla-ex99_1.htm>
27. Musunuru K, et al. 2025. “Patient-Specific In Vivo Gene Editing to Treat a Rare Genetic Disease.” *NEJM* 392:2235–2243. doi:10.1056/NEJMoa2504747
28. Children’s Hospital of Philadelphia, 2025-05-15. “World’s first patient treated with personalized CRISPR gene editing therapy.”  
    <https://chop.edu/news/worlds-first-patient-treated-personalized-crispr-gene-editing-therapy-childrens-hospital>
29. Prime Medicine, 2025-12. NEJM publication of PM359 data (p47phox CGD; DOI not verified).  
    <https://investors.primemedicine.com/news-releases/news-release-details/prime-medicine-announces-new-england-journal-medicine>
30. Wikipedia: “Prime editing.” <https://en.wikipedia.org/wiki/Prime_editing>
