class Obj3D {
  renderObj3d($container3d, urlGlb) {
    var n, t, o, a, d, l;

    if ($container3d == undefined) {
      $container3d = $(".js-container360");
    }

    function r () {
      o.aspect = window.innerWidth / window.innerHeight;
      o.updateProjectionMatrix();
      d.setSize(window.innerWidth, window.innerHeight);
    }
    
    (function processor () {
      o = new THREE.PerspectiveCamera( 75, $container3d.width() / $container3d.height(), 0.1, 1000 );
      o.position.z = 0;
      o.position.y = 0;
      o.position.x = 3;
      a = new THREE.Scene();

      var ambient = new THREE.AmbientLight(16777215,1);
      ambient.intensity = 0.5;
      a.add(ambient);

      var keyLight = new THREE.DirectionalLight(new THREE.Color("hsl(30, 100%, 75%)"),1);
      keyLight.position.set(-100, 0, 100);
      a.add(keyLight);
      
      var fillLight = new THREE.DirectionalLight(new THREE.Color("hsl(240, 100%, 75%)"),0.75);
      fillLight.position.set(100, 0, 100);
      a.add(fillLight);

      var backLight = new THREE.DirectionalLight(16777215,1);
      backLight.position.set(100, 0, -100).normalize();
      a.add(backLight);

      a.background = new THREE.Color(15790320);

      var e = window.location.href;
      var i = urlGlb;
      
      (new THREE.GLTFLoader()).load(urlGlb, function(e) {
        (l = e.scene).position.y = 0;
        
        var mroot = l;
        var bbox = new THREE.Box3().setFromObject(mroot);
        var cent = bbox.getCenter(new THREE.Vector3());
        var size = bbox.getSize(new THREE.Vector3());

        var maxAxis = Math.max(size.x, size.y, size.z);
        mroot.scale.multiplyScalar(3.0 / maxAxis);
        bbox.setFromObject(mroot);
        bbox.getCenter(cent);
        bbox.getSize(size);
        mroot.position.copy(cent).multiplyScalar(-1);
        mroot.position.y-= (size.y * 0);
        
        a.add(l);

      }, void 0, function(e) {
        console.error(e);
      });

      (d = new THREE.WebGLRenderer({
        antialias: !0
      })).setPixelRatio(window.devicePixelRatio);
      
      d.setSize($container3d.width(), $container3d.height());
      d.gammaOutput = !0;
      d.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));
      $container3d.html(d.domElement);

      window.addEventListener("resize", r, !1);
      
      (t = new THREE.OrbitControls(o,d.domElement)).enableDamping = !0;
      t.dampingFactor = 0.25;
      t.enableZoom = !0;
      t.enablePan = !1;
    })();

    (function e () {
      requestAnimationFrame(e);
      t.update();
      d.render(a, o);
    })();
  }

  handError (){
    $(".modal-degree360 #cboxTitle .headline-text").text("Um erro ocorreu ao carregar Objeto 3D");
  }
}

const obj3d = new Obj3D();