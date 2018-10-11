A website created for the Dean's Date Assignment of WRI-132 "The Posthuman".

The website can be visited at http://www.blockreferendum.com

  In order to properly use the site you will need to make it so that your browser can interact with the Ethereum Ropsten Test Network. In depth instructions on how to do this can be found on the bottom of the website's homepage, but in short you need to download and install Metamask (https://metamask.io/) so that you can run Ethereum dApps from a normal browser.

Project Goal:
  The goal of this project was to show the power of a decentralized computing network and its ability to cause positive change in democracy. I aimed to do this through the use of an Ethereum smart contract (see Contracts/BlockReferendum.sol) and creating a webpage that would allow citizens to actively vote on bills that are currently in Congress. I gathered all bill information from the ProPublica API (https://projects.propublica.org/api-docs/congress-api/). All computation on the website is done by the Ethereum network allowing for distributed and verifiable computation. At the moment the smart contract only exists on the Ropsten Test Network rather than the main network because of the cost associated with creating a smart contract on the Main Ethereum Network.

Design Decisions:
  One of the largest issues I had to deal with throughout this process was the utilization of gas by the smart contract. Gas is essentially your right of passage on the Ethereum network in the sense that you have to pay those are using their own computational resources on the network for the right to use their computation power. Being the poor college student I am then, I had to try to minimize this cost. The most obvious way that I did this was to only use the smart contract I created on the Ropsten Test Net. By doing this I did not have to 
  In order to track both votes for an against bills 

Process of making the site:
  Undertaking this project was a pretty crazy experience. Prior to beginning this project I had no experience working with almost all of the tools that I utilized. I had worked a little with html5 and css in the past, but other than that I was in the dark. Despite this and the fact that the deadline was rapidly approaching, I set out to learn and make use of a whole host of tools that I had only really ever read about or heard of before. This led to one very sleep deprived week. 
  
  First, I went from having a purely conceptual understanding of how smart contracts worked on the Ethereum network to rapidly learning the syntax of the language at the heart of all Ethereum smart contracts, Soldity. Thankfully, it was not a large jump from other C like languages I had worked with in the past and the only real hurdle here was grasping a few of the more technical aspects of the Ethereum network such as working with gas. The next step was then to find out how to best connect the smart contract to the webpage. I settled on web3.js (https://web3js.readthedocs.io/en/1.0/), a javascript API which connects Ethereum smart contracts to your code. I, however, had very little to no experience with javascript in the past so I quickly set about figuring out the general syntax and underlying mechanics of the language. After messing around with it a little I had at least a solid enough grasp of the language to begin working on the project. I settled on using jQuery to handle the changing states of the webpage as it possessed all the power I needed to create the webpage. I 

Utilized Tools:
  - javascript
  - jQuery (https://jquery.com/)
    - ajax
  - web3.js (https://web3js.readthedocs.io/en/1.0/)
  - Remix IDE (https://remix.ethereum.org)
  - html5
  - css
  
Going forward I hope to improve the css of the website, particularly the homepage, and some of the
