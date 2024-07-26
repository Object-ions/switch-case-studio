import React from 'react';
import '../../styles/components/_pricing.scss';

const Pricing = () => {
  return (
    <div className="pricing-table">
      <table>
        <thead>
          <tr>
            <th>Package</th>
            <th>Description</th>
            <th>Includes</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Landing Page</td>
            <td>
              Perfect for professional events and promotions. This package
              offers a sleek, simple one-pager that makes an instant impact.
              Ideal for events, product launches, or personal branding.
            </td>
            <td>
              <ul>
                <li>Professional design template</li>
                <li>Single responsive page</li>
                <li>Engaging slideshow to showcase key information</li>
                <li>SEO essentials to increase visibility</li>
                <li>Fast load times to keep your audience engaged</li>
              </ul>
            </td>
            <td>$700</td>
          </tr>
          <tr>
            <td>Simple Website</td>
            <td>
              Ideal for small businesses and personal portfolios. Expand your
              digital footprint with a website designed to grow with your needs.
            </td>
            <td>
              <ul>
                <li>Customizable design template</li>
                <li>Up to 5 pages tailored to your content needs</li>
                <li>Slideshow to highlight your products or services</li>
                <li>1 year of hosting and domain registration</li>
                <li>Basic SEO setup for better search engine ranking</li>
                <li>
                  Mobile responsiveness for optimal viewing on all devices
                </li>
              </ul>
            </td>
            <td>$1,200</td>
          </tr>
          <tr>
            <td>Standard Website</td>
            <td>
              Great for growing businesses needing more functionality. A robust
              website with comprehensive features to facilitate interaction and
              management.
            </td>
            <td>
              <ul>
                <li>Custom design to reflect your brand's unique identity</li>
                <li>Up to 10 pages of crafted content</li>
                <li>Content Management System (CMS) for easy updates</li>
                <li>Interactive contact form</li>
                <li>1 year of hosting and domain registration</li>
                <li>Basic SEO to enhance online presence</li>
                <li>Google Analytics integration for visitor insights</li>
              </ul>
            </td>
            <td>$2,500</td>
          </tr>
          <tr>
            <td>Professional Website</td>
            <td>
              A complete solution for e-commerce and complex business needs. For
              businesses aiming for the top with advanced functionality like
              e-commerce and detailed user interaction.
            </td>
            <td>
              <ul>
                <li>
                  Fully custom design tailored to your business requirements
                </li>
                <li>Unlimited pages for comprehensive content delivery</li>
                <li>Advanced CMS for full control over content</li>
                <li>Detailed contact forms and custom forms</li>
                <li>
                  E-commerce functionality, including shopping cart and secure
                  checkout
                </li>
                <li>
                  Database integration for products, users, and admin management
                </li>
                <li>1 year of hosting and domain registration</li>
                <li>Advanced SEO practices for superior web presence</li>
                <li>Ongoing technical support</li>
              </ul>
            </td>
            <td>$5,000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Pricing;
