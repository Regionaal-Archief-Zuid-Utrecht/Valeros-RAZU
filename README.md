# View-a-LOD
![image](https://github.com/user-attachments/assets/f47a545e-b86b-48e4-aaa7-51159863aa42)

> [!WARNING]  
> This project is still in the prototyping stage, and not yet ready for production.

A **flexible and configurable Linked Open Data viewer** using SPARQL and Elastic endpoints.

For technical documentation, please check the [project wiki](https://github.com/Simon-Dirks/view-a-LOD/wiki).

This project is a collaboration between [Het Utrechts Archief](https://hetutrechtsarchief.nl/), [Regionaal Archief Zuid-Utrecht](https://www.razu.nl/) and [Kasteel Amerongen](https://www.kasteelamerongen.nl/), developed by [Simon Dirks](https://simondirks.com). If you have any questions or comments about the project, please reach out to mail@simondirks.com.

## Projects using view-a-LOD
### Kasteel Amerongen pilot project
view-a-LOD was initially developed as a **Kasteel Amerongen [pilot project](https://lodpilot.kasteelamerongen.nl/)**, using Linked Open Data standards to bring together data of [Het Utrechts Archief](https://hetutrechtsarchief.nl/), [Regionaal Archief Zuid-Utrecht](https://www.razu.nl/) and [Kasteel Amerongen](https://www.kasteelamerongen.nl/) in a single search interface.

You can try the prototoype at [lodpilot.kasteelamerongen.nl](https://lodpilot.kasteelamerongen.nl).

For additional context, consider checking out the [NDE podcast](https://netwerkdigitaalerfgoed.nl/nieuws/podcast-paulus-en-de-nijs-op-reis-hoe-linked-data-verspreide-archieven-kasteel-amerongen-herenigt/) on the project. 

### RAZU viewer
The **[Regionaal Archief Zuid-Utrecht fork](https://github.com/Regionaal-Archief-Zuid-Utrecht/view-a-LOD-RAZU/tree/develop)** is being actively developed, and extends the pilot project's functionality with various features such as:
1. A built-in PDF viewer ([PDF.js](https://github.com/mozilla/pdf.js/)).
2. IIIF viewer ([Mirador](https://github.com/ProjectMirador/mirador)).
3. On-the-fly Office (doc, ppt, xls, etc) document to PDF conversion ([Gotenberg](https://github.com/gotenberg/gotenberg)).
4. Token generation ([SURA](https://github.com/Regionaal-Archief-Zuid-Utrecht/SURA)).

If of general (non-RAZU-specific) use, these features will be merged into this main repository in the near future.

## Dev

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.1, and uses [Tailwind CSS](https://tailwindcss.com/) for styling.

Run `ng serve` for a dev server. Run `ng build` to build the project.

If you run into node version issues, consider using something like [nvm](https://github.com/nvm-sh/nvm) (e.g., `nvm use 18`).

