import { Expose, plainToInstance, Transform, Type } from '../../src';
import 'reflect-metadata';

describe('expose default values', () => {
  class UserDetails {
    @Expose({})
    eyeColor?: string;

    @Expose({})
    eyeColorWithDefault?: string = '';

    @Expose({ name: 'HEIGHT' })
    @Transform(({ value }) => parseInt(value, 10))
    height?: number;

    @Expose({ name: 'HEIGHT_WITH_DEFAULT' })
    heightWithDefault?: number = 0;

    @Transform(({ value }) => !!value)
    isHealthy?: boolean;

    isHealthyWithDefault?: boolean = false;

    @Expose({})
    skills?: string[];

    @Expose({})
    skillsWithDefault?: string[] = [];
  }
  const defaultUserDetails = new UserDetails();
  defaultUserDetails.eyeColorWithDefault = 'Black';
  defaultUserDetails.heightWithDefault = 12;
  defaultUserDetails.skillsWithDefault = ['Testing'];
  defaultUserDetails.isHealthyWithDefault = false;

  class User {
    @Expose({ name: 'AGE' })
    @Transform(({ value }) => parseInt(value, 10))
    age: number;

    @Expose({ name: 'AGE_WITH_DEFAULT' })
    @Transform(({ value }) => parseInt(value, 10))
    ageWithDefault?: number = 18;

    @Expose({})
    firstName: string;

    @Expose({})
    firstNameWithDefault?: string = 'default first name';

    @Transform(({ value }) => !!value)
    admin: boolean;

    @Transform(({ value }) => !!value)
    adminWithDefault?: boolean = false;

    lastName: string;

    lastNameWithDefault?: string = '';

    country: string;

    countryWithDefault?: string = 'India';

    @Expose({})
    phoneNumbers: string[];

    @Expose({})
    phoneNumbersWithDefault: string[] = [];

    @Expose({})
    @Type(() => UserDetails)
    userDetails?: UserDetails;

    @Type(() => UserDetails)
    userDetailsWithDefault?: UserDetails = defaultUserDetails;
  }

  it('should set default value if nothing provided', () => {
    const fromPlainUser = {};
    const transformedUser = plainToInstance(User, fromPlainUser, {
      exposeDefaultValues: true,
      exposeUnsetFields: true,
    });
    expect(transformedUser).toBeInstanceOf(User);
    expect(transformedUser.userDetailsWithDefault).toBeInstanceOf(UserDetails);

    expect(transformedUser).toEqual({
      age: undefined,
      ageWithDefault: 18,
      firstName: undefined,
      firstNameWithDefault: 'default first name',
      adminWithDefault: false,
      lastNameWithDefault: '',
      countryWithDefault: 'India',
      phoneNumbersWithDefault: [],
      userDetails: undefined,
      userDetailsWithDefault: {
        eyeColorWithDefault: 'Black',
        heightWithDefault: 12,
        skillsWithDefault: ['Testing'],
        isHealthyWithDefault: false,
      },
    });
  });

  it('should take exposed values and ignore defaults', () => {
    const fromPlainUser = {};
    const transformedUser = plainToInstance(User, fromPlainUser, {
      exposeDefaultValues: false,
      exposeUnsetFields: true,
    });

    expect(transformedUser).toBeInstanceOf(User);
    expect(transformedUser.userDetailsWithDefault).toBeInstanceOf(UserDetails);
    expect(transformedUser).toEqual({
      age: NaN,
      ageWithDefault: NaN,
      firstName: undefined,
      firstNameWithDefault: undefined,
      adminWithDefault: false,
      lastNameWithDefault: '',
      countryWithDefault: 'India',
      phoneNumbers: undefined,
      phoneNumbersWithDefault: undefined,
      userDetails: undefined,
      userDetailsWithDefault: {
        eyeColorWithDefault: 'Black',
        heightWithDefault: 12,
        skillsWithDefault: ['Testing'],
        isHealthyWithDefault: false,
      },
    });
  });

  it('should take exposed values and ignore defaults and ignore unset values', () => {
    const fromPlainUser = {};
    const transformedUser = plainToInstance(User, fromPlainUser, {
      exposeDefaultValues: false,
      exposeUnsetFields: false,
    });

    expect(transformedUser).toBeInstanceOf(User);
    expect(transformedUser.userDetailsWithDefault).toBeInstanceOf(UserDetails);
    expect(transformedUser).toEqual({
      age: NaN,
      ageWithDefault: NaN,
      adminWithDefault: false,
      lastNameWithDefault: '',
      countryWithDefault: 'India',
      userDetailsWithDefault: {
        eyeColorWithDefault: 'Black',
        heightWithDefault: 12,
        skillsWithDefault: ['Testing'],
        isHealthyWithDefault: false,
      },
    });
  });

  it('should take exposed values and defaults and ignore unset values', () => {
    const fromPlainUser = {};
    const transformedUser = plainToInstance(User, fromPlainUser, {
      exposeDefaultValues: true,
      exposeUnsetFields: false,
    });

    expect(transformedUser).toBeInstanceOf(User);
    expect(transformedUser.userDetailsWithDefault).toBeInstanceOf(UserDetails);
    expect(transformedUser).toEqual({
      ageWithDefault: 18,
      firstNameWithDefault: 'default first name',
      adminWithDefault: false,
      lastNameWithDefault: '',
      countryWithDefault: 'India',
      phoneNumbersWithDefault: [],
      userDetailsWithDefault: {
        eyeColorWithDefault: 'Black',
        heightWithDefault: 12,
        skillsWithDefault: ['Testing'],
        isHealthyWithDefault: false,
      },
    });
  });

  it('should set default value if nothing provided and instantiate class properly', () => {
    const fromPlainUser = {
      age: 20,
      firstName: 'John',
      admin: true,
      lastName: 'Doe',
      country: 'US',
      phoneNumbers: ['99999999999'],
      userDetails: {
        eyeColor: 'Grey',
        height: 10,
        skills: ['Coding'],
        isHealthy: true,
      },
    };
    const transformedUser = plainToInstance(User, fromPlainUser, {
      exposeDefaultValues: true,
      exposeUnsetFields: true,
    });
    expect(transformedUser).toBeInstanceOf(User);
    expect(transformedUser.userDetailsWithDefault).toBeInstanceOf(UserDetails);
    expect(transformedUser.userDetails).toBeInstanceOf(UserDetails);

    expect(transformedUser).toEqual({
      age: 20,
      ageWithDefault: 18,
      firstName: 'John',
      firstNameWithDefault: 'default first name',
      admin: true,
      adminWithDefault: false,
      lastName: 'Doe',
      lastNameWithDefault: '',
      country: 'US',
      countryWithDefault: 'India',
      phoneNumbers: ['99999999999'],
      phoneNumbersWithDefault: [],
      userDetails: {
        eyeColor: 'Grey',
        eyeColorWithDefault: '',
        height: 10,
        heightWithDefault: 0,
        skills: ['Coding'],
        skillsWithDefault: [],
        isHealthy: true,
        isHealthyWithDefault: false,
      },
      userDetailsWithDefault: {
        eyeColorWithDefault: 'Black',
        heightWithDefault: 12,
        skillsWithDefault: ['Testing'],
        isHealthyWithDefault: false,
      },
    });
  });

  it('should take exposed values and ignore defaults', () => {
    const fromPlainUser = {
      age: 20,
      firstName: 'John',
      admin: true,
      lastName: 'Doe',
      country: 'US',
      phoneNumbers: ['99999999999'],
      userDetails: {
        eyeColor: 'Grey',
        height: 10,
        skills: ['Coding'],
        isHealthy: true,
      },
    };
    const transformedUser = plainToInstance(User, fromPlainUser, {
      exposeDefaultValues: false,
      exposeUnsetFields: true,
    });

    expect(transformedUser).toBeInstanceOf(User);
    expect(transformedUser.userDetailsWithDefault).toBeInstanceOf(UserDetails);
    expect(transformedUser).toEqual({
      age: NaN,
      ageWithDefault: NaN,
      firstName: 'John',
      firstNameWithDefault: undefined,
      admin: true,
      adminWithDefault: false,
      lastName: 'Doe',
      lastNameWithDefault: '',
      country: 'US',
      countryWithDefault: 'India',
      phoneNumbers: ['99999999999'],
      phoneNumbersWithDefault: undefined,
      userDetails: {
        eyeColor: 'Grey',
        eyeColorWithDefault: undefined,
        height: NaN,
        heightWithDefault: undefined,
        skills: ['Coding'],
        skillsWithDefault: undefined,
        isHealthy: true,
        isHealthyWithDefault: false,
      },
      userDetailsWithDefault: {
        eyeColorWithDefault: 'Black',
        heightWithDefault: 12,
        skillsWithDefault: ['Testing'],
        isHealthyWithDefault: false,
      },
    });
  });

  it('should take exposed values and ignore defaults and ignore unset values', () => {
    const fromPlainUser = {
      age: 20,
      firstName: 'John',
      admin: true,
      lastName: 'Doe',
      country: 'US',
      phoneNumbers: ['99999999999'],
      userDetails: {
        eyeColor: 'Grey',
        height: 10,
        skills: ['Coding'],
        isHealthy: true,
      },
    };
    const transformedUser = plainToInstance(User, fromPlainUser, {
      exposeDefaultValues: false,
      exposeUnsetFields: false,
    });

    expect(transformedUser).toBeInstanceOf(User);
    expect(transformedUser.userDetailsWithDefault).toBeInstanceOf(UserDetails);
    expect(transformedUser).toEqual({
      age: NaN,
      ageWithDefault: NaN,
      firstName: 'John',
      admin: true,
      adminWithDefault: false,
      lastName: 'Doe',
      lastNameWithDefault: '',
      country: 'US',
      countryWithDefault: 'India',
      phoneNumbers: ['99999999999'],
      userDetails: {
        eyeColor: 'Grey',
        height: NaN,
        heightWithDefault: 0,
        skills: ['Coding'],
        isHealthy: true,
        isHealthyWithDefault: false,
      },
      userDetailsWithDefault: {
        eyeColorWithDefault: 'Black',
        heightWithDefault: 12,
        skillsWithDefault: ['Testing'],
        isHealthyWithDefault: false,
      },
    });
  });

  it('should take exposed values and defaults and ignore unset values', () => {
    const fromPlainUser = {
      age: 20,
      admin: true,
      lastName: 'Doe',
      country: 'US',
      phoneNumbers: ['99999999999'],
      userDetails: {
        eyeColor: 'Grey',
        height: 10,
        skills: ['Coding'],
        isHealthy: true,
      },
    };
    const transformedUser = plainToInstance(User, fromPlainUser, {
      exposeDefaultValues: true,
      exposeUnsetFields: false,
    });

    expect(transformedUser).toBeInstanceOf(User);
    expect(transformedUser.userDetailsWithDefault).toBeInstanceOf(UserDetails);
    expect(transformedUser).toEqual({
      age: 20,
      ageWithDefault: 18,
      firstNameWithDefault: 'default first name',
      admin: true,
      adminWithDefault: false,
      lastName: 'Doe',
      lastNameWithDefault: '',
      country: 'US',
      countryWithDefault: 'India',
      phoneNumbers: ['99999999999'],
      phoneNumbersWithDefault: [],
      userDetails: {
        eyeColor: 'Grey',
        eyeColorWithDefault: '',
        height: 10,
        heightWithDefault: 0,
        skills: ['Coding'],
        skillsWithDefault: [],
        isHealthy: true,
        isHealthyWithDefault: false,
      },
      userDetailsWithDefault: {
        eyeColorWithDefault: 'Black',
        heightWithDefault: 12,
        skillsWithDefault: ['Testing'],
        isHealthyWithDefault: false,
      },
    });
  });
});
