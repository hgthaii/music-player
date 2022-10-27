const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STOGARE_KEY = 'PLAYER_STOGARE';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STOGARE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STOGARE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/music/song1.mp3',
            image: './assets/img/img1.jpg',
        },
        {
            name: 'Summertime',
            singer: 'K-391',
            path: './assets/music/song2.mp3',
            image: './assets/img/img2.jpg',
        },
        {
            name: 'Unity',
            singer: 'TheFatrat',
            path: './assets/music/song3.mp3',
            image: './assets/img/img3.jpg',
        },
        {
            name: 'Reality',
            singer: 'Lost Requencies',
            path: './assets/music/song4.mp3',
            image: './assets/img/img4.jpg',
        },
        {
            name: 'With you',
            singer: 'Hoaprox',
            path: './assets/music/song5.mp3',
            image: './assets/img/img5.jpg',
        },
        {
            name: 'No Internet',
            singer: '7UPPERCUTS',
            path: './assets/music/song6.mp3',
            image: './assets/img/img6.jpg',
        },
        {
            name: 'Yêu',
            singer: '7UPPERCUTS',
            path: './assets/music/song7.mp3',
            image: './assets/img/img7.jpg',
        },
        {
            name: 'Đen đá không đường',
            singer: 'Amee, Hieuthuhai',
            path: './assets/music/song8.mp3',
            image: './assets/img/img8.jpg',
        },
        {
            name: 'Way back home',
            singer: 'SHAEUN',
            path: './assets/music/song9.mp3',
            image: './assets/img/img9.jpg',
        },
        {
            name: 'Alone',
            singer: 'Alan Walker',
            path: './assets/music/song10.mp3',
            image: './assets/img/img10.jpg',
        },
    ],
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        console.log(document);

        // Xử lý phóng to, thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý khi người dùng click Play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Khi bài hát được play
        audio.onplay = function () {
            addEventListener('keydown', function (e) {
                if (e.keyCode == 32) {
                    _this.isPlaying = true;
                    player.classList.add('playing');
                    cdThumbAnimate.play();
                    // console.log(e.code);
                } else {
                    // Khi bài hát bị pause
                    audio.onpause = function () {
                        _this.isPlaying = false;
                        player.classList.remove('playing');
                        cdThumbAnimate.pause();
                    };
                }
            });
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
            progress.value = progressPercent;
        };

        // Xử lý khi tua bài hát
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // Xử lý CD quay và dừng lại
        const cdThumbAnimate = cdThumb.animate(
            [
                {
                    transform: 'rotate(360deg)',
                },
            ],
            {
                duration: 10000, // 10 seconds
                iterations: Infinity, // CD xoay vô tận
            },
        );
        cdThumbAnimate.pause();

        // Xử lý khi Next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Xử lý khi Previous bài hát
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Xử lý khi Random bật tắt
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        };

        // Xử lý Next bài hát khi bài hát hiện tại kết thúc
        audio.onended = function () {
            if (_this.isRepeat) {
                _this.render();
                audio.play();
            }
            nextBtn.click();
        };

        // Xử lý lặp lại một bài hát
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            // _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', this.isRepeat);
        };

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');

            if (songNode || e.target.closest('.option')) {
                // Xử lý khi click vào bài hát
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào option
                if (e.target.closest('.option')) {
                }
            }
        };
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index == this.currentIndex ? 'active' : ''}" data-index='${index}'>
                        <div
                            class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`;
        });
        playlist.innerHTML = htmls.join('');
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 200);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe và xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // // active 2 buttons random và repeat khi lần đầu chạy
        // randomBtn.classList.toggle('active', this.isRandom);
        // repeatBtn.classList.toggle('active', this.isRepeat);

        $(document).keypress(function (e) {
            var keyCode = e.keyCode ? e.keyCode : e.which;
            if (keyCode == '13') {
                alert('ban vua nhan phim enter');
            }
        });
    },
};

app.start();
