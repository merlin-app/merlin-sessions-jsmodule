const merlin = {
  dev:         true,
  tenant_id:   -1,
  tenant_name: '',
  api_key:     '',
  user_id:     -1,
  wallet_address: null,
  enviornment_type: '',

  init(config) {
    window.merlinHost = this.dev ? 'dev.events.getmerlin.site' : 'events.getmerlin.site';

    this.tenant_id        = config?.tenant_id;
    this.tenant_name      = config?.tenant_name;
    this.api_key          = config?.api_key;
    this.user_id          = config?.user_id;
    this.wallet_address   = config?.wallet_address;
    this.enviornment_type = config?.enviornment_type;

    window.addEventListener('load', () => {
      this.send({
        event_name: 'Page visit',
        event_type: 'page_visit'
      });

      let startTime = Date.now();
      const timer = document.querySelector('.js-timer');
      setInterval(() => {
        timer.textContent = ((Date.now() - startTime) / 1000).toFixed(0);
      }, 1000);
  
      Array.from( document.querySelectorAll('.merlin-click') ).forEach(element => {
        element.addEventListener('click', e => {
          this.send({
            event_type: 'click',
            ...this.collectParams(element)
          });
        });
      });
  
      Array.from( document.querySelectorAll('.merlin-hover') ).forEach(element => {
        element.addEventListener('mouseover', e => {
          this.send({
            event_name: 'Link hover',
            event_type: 'hover',
            user_properties: {
              customValue: 999
            }
          });
        });
      });
  
      Array.from( document.querySelectorAll('.merlin-enter-viewport') ).forEach(element => {
        let firstTrigger = true;
        let startTime;
        let timer;

        const observer = new IntersectionObserver((entries, observer) => {
          for (let entry of entries) {
            if (entry.isIntersecting) {
              // Пересечение происходит тут
              startTime = Date.now();
              this.send({
                event_name: 'Element entered viewport',
                event_type: 'enter_viewport'
              });

              const goal = Number(element.getAttribute('data-goal'));
              if (goal && !isNaN(goal)) {
                timer = setInterval(() => {
                  const elapsed = Date.now() - startTime;
                  if (elapsed >= goal) {
                    this.send({
                      event_name: `Header has been seen for ${(goal / 1000).toFixed(0)} seconds`,
                      event_type: 'viewport_goal',
                      event_properties: {
                        goal: (goal / 1000).toFixed(0) + 's'
                      }
                    });
                    clearInterval(timer);
                  }
                }, 150);
              }
            }
            else {
              if (!firstTrigger) {
                this.send({
                  event_name: 'Element left viewport',
                  event_type: 'leave_viewport',
                  event_properties: {
                    time: ((Date.now() - startTime) / 1000).toFixed(1) + 's'
                  }
                });
              }
            }

            if (firstTrigger) {
              firstTrigger = false;
              return;
            }
          }
        }, { threshold: 0 });
        observer.observe(element);
      });

    });

    console.log('Merlin analytics initialized');
  },

  collectParams(element) {
    const params = {};
    
    if (element.hasAttribute('data-merlin-event-name')) {
      params.event_name = element.getAttribute('data-merlin-event-name');
    }

    if (element.hasAttribute('data-merlin-event-type')) {
      params.event_type = element.getAttribute('data-merlin-event-type');
    }

    if (element.hasAttribute('data-merlin-auth-project')) {
      params.auth_project = JSON.parse( element.getAttribute('data-merlin-auth-project').replace(/'/g, '"') );
    }

    if (element.hasAttribute('data-merlin-other-admin-variables')) {
      params.other_admin_variables = JSON.parse( element.getAttribute('data-merlin-other-admin-variables').replace(/'/g, '"') );
    }

    if (element.hasAttribute('data-merlin-event-properties')) {
      params.event_properties = JSON.parse( element.getAttribute('data-merlin-event-properties').replace(/'/g, '"') );
    }

    if (element.hasAttribute('data-merlin-user-properties')) {
      params.user_properties = JSON.parse( element.getAttribute('data-merlin-user-properties').replace(/'/g, '"') );
    }

    return params;
  },

  async send(options) {
    const {
      event_name,
      event_type,
      auth_project,
      user_ids,
      other_admin_variables,
      event_properties,
      user_properties
    } = options;

    const json = {
      event_name,
      event_type,
      auth_project: {
        tenant_id:   this.tenant_id,
        tenant_name: this.tenant_name?.toLowerCase(),
        api_key:     this.api_key,
        ...auth_project
      },
      user_ids: {
        user_id:        this.user_id,
        wallet_address: this.wallet_address?.toLowerCase(),
        ...user_ids
      },
      other_admin_variables: {
        insert_id:   0,
        app_version: '',
        ...other_admin_variables
      },
      event_properties: event_properties ?? {},
      user_properties:  user_properties  ?? {},
      automatically_tracked: this.user,
      enviornment_type: this.enviornment_type
    };

    // Here we'll make a request to the server
    try {
      const response = await fetch(`https://${window.merlinHost ?? 'dev.events.getmerlin.site'}/add_event`, {
        method: 'POST',
        body: JSON.stringify(json)
      });
      const data = await response.json();
      console.log(data);
      return data;
    }
    catch (e) {
      console.error(e);
    }
  },

  get browser() {
    let { userAgent, appName } = navigator;
    let browser = appName;
    let nameOffset;
    let verOffset;

    // Opera
    if ((userAgent.indexOf('Opera')) != -1) {
      browser = 'Opera';
    }
    // Opera Next
    if ((userAgent.indexOf('OPR')) != -1) {
      browser = 'Opera';
    }
    // Legacy Edge
    else if ((userAgent.indexOf('Edge')) != -1) {
      browser = 'Microsoft Legacy Edge';
    }
    // Edge (Chromium)
    else if ((userAgent.indexOf('Edg')) != -1) {
      browser = 'Microsoft Edge';
    }
    // MSIE
    else if ((userAgent.indexOf('MSIE')) != -1) {
      browser = 'Microsoft Internet Explorer';
    }
    // Chrome
    else if ((userAgent.indexOf('Chrome')) != -1) {
      browser = 'Chrome';
    }
    // Safari
    else if ((userAgent.indexOf('Safari')) != -1) {
      browser = 'Safari';
    }
    // Firefox
    else if ((userAgent.indexOf('Firefox')) != -1) {
      browser = 'Firefox';
    }
    // MSIE 11+
    else if (userAgent.indexOf('Trident/') != -1) {
      browser = 'Microsoft Internet Explorer';
    }
    // Other browsers
    else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) < (userAgent.lastIndexOf('/'))) {
      browser = userAgent.substring(nameOffset, verOffset);
      if (browser.toLowerCase() == browser.toUpperCase()) {
        browser = appName;
      }
    }

    return browser;
  },

  get os() {
    // system
    var os = 'unknown';
    var clientStrings = [
      { s: 'Windows 10',          r: /(Windows 10.0|Windows NT 10.0)/ },
      { s: 'Windows 8.1',         r: /(Windows 8.1|Windows NT 6.3)/ },
      { s: 'Windows 8',           r: /(Windows 8|Windows NT 6.2)/ },
      { s: 'Windows 7',           r: /(Windows 7|Windows NT 6.1)/ },
      { s: 'Windows Vista',       r: /Windows NT 6.0/ },
      { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
      { s: 'Windows XP',          r: /(Windows NT 5.1|Windows XP)/ },
      { s: 'Windows 2000',        r: /(Windows NT 5.0|Windows 2000)/ },
      { s: 'Windows ME',          r: /(Win 9x 4.90|Windows ME)/ },
      { s: 'Windows 98',          r: /(Windows 98|Win98)/ },
      { s: 'Windows 95',          r: /(Windows 95|Win95|Windows_95)/ },
      { s: 'Windows NT 4.0',      r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
      { s: 'Windows CE',          r: /Windows CE/ },
      { s: 'Windows 3.11',        r: /Win16/ },
      { s: 'Android',             r: /Android/ },
      { s: 'Open BSD',            r: /OpenBSD/ },
      { s: 'Sun OS',              r: /SunOS/ },
      { s: 'Chrome OS',           r: /CrOS/ },
      { s: 'Linux',               r: /(Linux|X11(?!.*CrOS))/ },
      { s: 'iOS',                 r: /(iPhone|iPad|iPod)/ },
      { s: 'Mac OS X',            r: /Mac OS X/ },
      { s: 'Mac OS',              r: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
      { s: 'QNX',                 r: /QNX/ },
      { s: 'UNIX',                r: /UNIX/ },
      { s: 'BeOS',                r: /BeOS/ },
      { s: 'OS/2',                r: /OS\/2/ },
      { s: 'Search Bot',          r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
    ];
    for (var id in clientStrings) {
      var cs = clientStrings[id];
      if (cs.r.test(navigator.userAgent)) {
        os = cs.s;
        break;
      }
    }

    if (/Windows/.test(os)) {
      os = 'Windows';
    }

    return os;
  },

  get device() {
    const { appVersion } = navigator;
    return /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(appVersion) ? 'mobile' : 'desktop';
  },

  get language() {
    return navigator.language || navigator.userLanguage;
  },

  get user() {
    return {
      browser_type: this.browser,
      os_name:      this.os,
      device_type:  this.device,
      timestamp:    Date.now(),
      url:          location.href,
      referrer:     null,
      country:      null,
      language:     this.language
    };
  }
};