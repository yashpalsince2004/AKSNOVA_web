import { withBase } from './paths';

// Company artwork from verified local assets and high-res source repositories.
export const rawCompanyLogos: Record<string, string> = {
  'TCS': '/logos/companies/tcs-verified.svg',
  'Infosys': '/logos/companies/infosys.svg',
  'Wipro': '/logos/companies/wipro.svg',
  'Accenture': '/logos/companies/accenture.svg',
  'Capgemini': '/logos/companies/capgemini-verified.svg',
  'Cognizant': '/logos/companies/cognizant.svg',
  'HCLTech': '/logos/companies/hcltech.svg',
  'Tech Mahindra': '/logos/companies/techmahindra.svg',
  'Mindgate Solutions Pvt. Ltd.': '/logos/companies/mindgate_solutions.svg',
  'WP Translation and Testing Services Pvt. Ltd.': '/logos/companies/wp_translation.png',
  'Mindspace Software Technologies Pvt. Ltd.': '/logos/companies/mindspace_software.png',
  'PlantIT': '/logos/companies/reference-plantit.png',
  'Galentic Technologies Pvt. Ltd.': '/logos/companies/galentic_technologies.png',
  'Technopurple IT Solution': '/logos/companies/technopurple.svg',
  'AQM Technologies Pvt. Ltd.': '/logos/companies/aqm_technologies.jpg',
  'Vistaar Systems Pvt. Ltd.': '/logos/companies/vistaar_systems.png',
  'Comflex Technologies Pvt. Ltd.': '/logos/companies/comflex.png',
  'Exegesis Infotech India Pvt. Ltd.': '/logos/companies/exegesis_infotech.png',
  'ARCOT Groups': '/logos/companies/reference-arcot-groups.png',
  'Kaizen Infotech Solutions Pvt. Ltd.': '/logos/companies/kaizen_infotech.svg',
  'eClerx Services Limited': '/logos/companies/eclerx.svg',
  'EINS Technologies India Pvt. Ltd.': '/logos/companies/eins_technologies.png',
  'Sounce Retail Pvt. Ltd.': '/logos/companies/reference-sounce-retail.png',
  'YES BANK': '/logos/companies/reference-yes-bank.png',
  'Network TechLab (I) Pvt. Ltd.': '/logos/companies/network_techlab.png',
  'Greytrix Business Solutions Pvt. Ltd.': '/logos/companies/greytrix.png',
  'Metricroid Technology Solutions Pvt. Ltd.': '/logos/companies/reference-metricroid.png',
  'Piramal Finance': '/logos/companies/reference-piramal-finance.png',
  'Astrika Infotech Pvt. Ltd.': '/logos/companies/astrika_infotech.png',
  'Expenzing': '/logos/companies/expenzing.png',
  'Fermion Infotech Pvt. Ltd.': '/logos/companies/fermion_infotech.svg',
  'E-Stone Information Technology Pvt. Ltd.': '/logos/companies/e-stone_it.png',
  'Secret Technologies India': '/logos/companies/reference-secret-technologies.png',
  'VMS Group': '/logos/companies/vms_group.jpg',
  'DSmart HR Solution & Services': '/logos/companies/reference-dsmart-hr.png',
  'Seap Infotech Pvt. Ltd.': '/logos/companies/reference-seap-infotech.png',
  'Clear Intentions': '/logos/companies/reference-clear-intentions.png',
  'WebMobi360': '/logos/companies/reference-webmobi360.png',
  'Digipxpressions Media Pvt. Ltd.': '/logos/companies/reference-digipxpressions.png',
  'Universal Media': '/logos/companies/reference-universal-media.png',
  'Caresoft Systems Pvt. Ltd.': '/logos/companies/reference-caresoft-systems.png',
  'Aaztech Software Solution': '/logos/companies/reference-aaztech.png',
  'Hasba IT Solutions': '/logos/companies/reference-hasba-it.png',
};

export const companyLogos: Record<string, string> = Object.fromEntries(
  Object.entries(rawCompanyLogos).map(([k, v]) => [k, withBase(v)])
);

/**
 * Returns the company artwork pointer and fallback label
 */
export function getCompanyArtwork(name: string): { logo?: string | undefined; fallback: string } {
  const cleanFallback = name.replace(/\s*(Pvt\.? Ltd\.?|Limited|\(I\))\s*/g, ' ').trim();
  return {
    logo: companyLogos[name],
    fallback: cleanFallback,
  };
}
