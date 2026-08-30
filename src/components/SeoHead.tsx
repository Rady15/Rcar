import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const SeoHead: React.FC = () => {
  const {
    language,
    currentPage,
    globalSeo,
    pageSeoConfigs,
    schemaConfig,
    seoReady,
    cars,
    branches
  } = useApp();

  useEffect(() => {
    if (!seoReady) return;
    // 1. Find matching page config or fallback to global
    const pageConfig = pageSeoConfigs.find((p) => p.id === currentPage);

    const titleText = pageConfig
      ? `${pageConfig.title[language]} ${globalSeo.titleSeparator} ${globalSeo.siteName[language]}`
      : `${globalSeo.defaultTitle[language]} ${globalSeo.titleSeparator} ${globalSeo.siteName[language]}`;

    const descriptionText = pageConfig
      ? pageConfig.description[language]
      : globalSeo.metaDescription[language];

    const keywordsText = pageConfig
      ? [...pageConfig.keywords[language], ...globalSeo.defaultKeywords[language]].join(', ')
      : globalSeo.defaultKeywords[language].join(', ');

    const canonicalUrl = `${globalSeo.canonicalBaseUrl}${pageConfig?.canonicalSlug || ''}`;
    const ogImage = pageConfig?.ogImage || globalSeo.ogImage;

    // Update document title
    document.title = titleText;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', descriptionText);

    // Update Meta Keywords
    let metaKw = document.querySelector('meta[name="keywords"]');
    if (!metaKw) {
      metaKw = document.createElement('meta');
      metaKw.setAttribute('name', 'keywords');
      document.head.appendChild(metaKw);
    }
    metaKw.setAttribute('content', keywordsText);

    // Update Robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute(
      'content',
      pageConfig?.isIndexed ? globalSeo.robotsIndexing : 'noindex, nofollow'
    );

    // Update Geo Meta Tags (for Saudi Search & Local Maps)
    const setMetaTag = (attrName: 'name' | 'property', attrVal: string, content: string) => {
      let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMetaTag('name', 'geo.region', globalSeo.geoRegion);
    setMetaTag('name', 'geo.placename', globalSeo.geoPlacename);
    setMetaTag('name', 'geo.position', globalSeo.geoPosition);
    setMetaTag('name', 'ICBM', globalSeo.icbm);

    // OpenGraph Meta Tags
    setMetaTag('property', 'og:site_name', globalSeo.siteName[language]);
    setMetaTag('property', 'og:title', titleText);
    setMetaTag('property', 'og:description', descriptionText);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:locale', language === 'ar' ? 'ar_SA' : 'en_US');

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', globalSeo.twitterCard);
    setMetaTag('name', 'twitter:site', globalSeo.twitterSite);
    setMetaTag('name', 'twitter:title', titleText);
    setMetaTag('name', 'twitter:description', descriptionText);
    setMetaTag('name', 'twitter:image', ogImage);

    // Canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Google Site Verification
    if (globalSeo.googleSiteVerification) {
      setMetaTag('name', 'google-site-verification', globalSeo.googleSiteVerification);
    }

    // 2. Structured Data Schema.org (JSON-LD)
    const existingSchemaScript = document.getElementById('alrafagha-jsonld-schema');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    const schemas: any[] = [];

    // LocalBusiness / AutoRental Schema
    if (schemaConfig.enableAutoRentalSchema) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        '@id': `${globalSeo.canonicalBaseUrl}/#autorental`,
        name: schemaConfig.companyLegalName[language],
        alternateName: ['الرفاهة لتأجير السيارات', 'Al-Rifaha Car Hire Saudi Arabia'],
        url: globalSeo.canonicalBaseUrl,
        logo: `${globalSeo.canonicalBaseUrl}/logo.png`,
        image: globalSeo.ogImage,
        description: globalSeo.metaDescription[language],
        telephone: schemaConfig.telephone,
        email: schemaConfig.email,
        priceRange: schemaConfig.priceRange,
        currenciesAccepted: schemaConfig.currenciesAccepted,
        paymentAccepted: schemaConfig.paymentAccepted,
        address: {
          '@type': 'PostalAddress',
          streetAddress: schemaConfig.streetAddress[language],
          addressLocality: schemaConfig.addressLocality[language],
          postalCode: schemaConfig.postalCode,
          addressCountry: schemaConfig.addressCountry
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 24.7136,
          longitude: 46.6753
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday'
            ],
            opens: '00:00',
            closes: '23:59'
          }
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: schemaConfig.ratingValue,
          reviewCount: schemaConfig.reviewCount,
          bestRating: 5,
          worstRating: 1
        },
        sameAs: [
          'https://twitter.com/AlRifahaRental',
          'https://instagram.com/alrafagharental',
          'https://linkedin.com/company/alrafagha'
        ]
      });
    }

    // Vehicle Catalog Schema (Products)
    if (schemaConfig.enableCarProductsSchema && cars.length > 0) {
      const topCars = cars.slice(0, 8);
      const vehicleItems = topCars.map((car) => ({
        '@type': 'Car',
        name: car.name[language],
        model: car.name[language],
        brand: {
          '@type': 'Brand',
          name: car.brand
        },
        vehicleModelDate: car.modelYear.toString(),
        vehicleSeatingCapacity: car.seats,
        vehicleTransmission: car.transmission === 'auto' ? 'Automatic' : 'Manual',
        fuelType: car.fuelType,
        image: car.image,
        offers: {
          '@type': 'Offer',
          price: car.dailyPrice,
          priceCurrency: 'SAR',
          availability: 'https://schema.org/InStock',
          priceValidUntil: '2026-12-31',
          url: `${globalSeo.canonicalBaseUrl}/fleet`
        }
      }));

      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: language === 'ar' ? 'أسطول سيارات الرفاهة المتاح للإيجار' : 'Al-Rifaha Rental Fleet',
        itemListElement: vehicleItems
      });
    }

    // BreadcrumbList Schema
    if (schemaConfig.enableBreadcrumbSchema) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: language === 'ar' ? 'الرئيسية' : 'Home',
            item: globalSeo.canonicalBaseUrl
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: pageConfig?.name[language] || 'الصفحة',
            item: `${globalSeo.canonicalBaseUrl}${pageConfig?.canonicalSlug || ''}`
          }
        ]
      });
    }

    // Inject JSON-LD Script tag
    if (schemas.length > 0) {
      const scriptTag = document.createElement('script');
      scriptTag.id = 'alrafagha-jsonld-schema';
      scriptTag.type = 'application/ld+json';
      scriptTag.text = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2);
      document.head.appendChild(scriptTag);
    }
  }, [language, currentPage, globalSeo, pageSeoConfigs, schemaConfig, seoReady, cars, branches]);

  return null;
};
