# KeyBase Signup for Carleton Student

The aim of this project is to develop a means by which a Carleton University student can easily get set-up and running with 
a public private key without having to go through any PGP, S/MIME training or bakcground reading.

The application is to be a client side UI which will guide the user through a sign up and longin process, which communicates with a server which will handle the keybase login and account setup as a means of bootstraping End-to-End Email using keybase  and social media identities.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

To install the software:
* Node.js and npm

```
Give examples
```

### Installing

The electron framework is agnostic front end which utilises a minimal Chromium engine. All that is needed to build and run 
the application is NodeJs and npm. Folllwing the instructions below will lead you through the process.

Install node js from git Bash or Unix terminal 

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

On Windows machines visit the NodeJS website

```
https://nodejs.org
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **sslpoe** - *Initial work* - [Poerilla](https://github.com/Poerilla)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used from the keybase developers to the npm community
* Inspiration: The secure email app Confidate https://www.franziroesner.com/pdf/confidante-eurosp17.pdf
* Credit to https://gist.github.com/PurpleBooth/109311bb0361f32d87a2 for the readmen template
