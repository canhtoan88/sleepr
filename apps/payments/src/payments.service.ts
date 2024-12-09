import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '@app/common';

@Injectable()
export class PaymentsService {
  private readonly apiKey = this.configService.get<string>(
    'STRIPE_SECRET_KEY',
    { infer: true },
  );
  private readonly stripe = new Stripe(this.apiKey, {
    apiVersion: '2024-11-20.acacia',
  });

  constructor(
    private readonly configService: ConfigService<{
      STRIPE_SECRET_KEY: string;
    }>,
  ) {}

  async createCharge({ amount }: CreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card: { token: 'tok_visa' },
    // });

    /*
    paymentMethod: {
      id: 'pm_1QTn0iHHDlXicIqx2RseVOGY',
      object: 'payment_method',
      allow_redisplay: 'unspecified',
      billing_details: {
        address: {
          city: null,
          country: null,
          line1: null,
          line2: null,
          postal_code: null,
          state: null,
        },
        email: null,
        name: null,
        phone: null,
      },
      card: {
        brand: 'visa',
        checks: {
          address_line1_check: null,
          address_postal_code_check: null,
          cvc_check: 'unchecked',
        },
        country: 'US',
        display_brand: 'visa',
        exp_month: 12,
        exp_year: 2025,
        fingerprint: 'hY1aKtdBwXlOqq2g',
        funding: 'credit',
        generated_from: null,
        last4: '4242',
        networks: { available: [Array], preferred: null },
        three_d_secure_usage: { supported: true },
        wallet: null,
      },
      created: 1733674028,
      customer: null,
      livemode: false,
      metadata: {},
      type: 'card',
    };
    */

    return this.stripe.paymentIntents.create({
      // payment_method: paymentMethod.id, // use this with payment_method_types: ['card']
      amount: amount * 100,
      currency: 'usd',
      confirm: true,
      payment_method: 'pm_card_visa',
      // payment_method_types: ['card'], // Need to disabled automatic_payment_methods before enable this
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
  }
}
